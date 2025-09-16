import { Router } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { authenticate, AuthRequest } from "./middleware/auth";
import { config } from "./config";
import { Order } from "./models/Order";
import { User } from "./models/User";
import { sendMail } from "./services/email";
import { sendSms } from "./services/sms";

const router = Router();

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

// Create Razorpay order for an Order document
router.post("/create-order", authenticate, async (req: AuthRequest, res) => {
  const {
    amount,
    currency = "INR",
    receipt,
    notes,
    items,
    shippingAddress,
  } = req.body as {
    amount: number; // in rupees
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
    items: { product: string; quantity: number; unitPrice: number }[];
    shippingAddress?: string;
  };

  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Amount required" });

  // Get user details for shipping address
  const user = await User.findById(req.user!.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Use provided shipping address or construct from user profile
  const finalShippingAddress =
    shippingAddress ||
    `${user.address}, ${user.city}, ${user.state} - ${user.pincode}`;

  // Create local order first
  const orderDoc = await Order.create({
    user: req.user!.id,
    items,
    amount,
    status: "pending",
    paymentProvider: "razorpay",
    shippingAddress: finalShippingAddress,
  });

  // Razorpay expects paise
  const options = {
    amount: Math.round(amount * 100),
    currency,
    receipt: receipt || orderDoc.id,
    notes: { ...(notes || {}), orderId: orderDoc.id },
  };

  const rpOrder = await razorpay.orders.create(options);
  orderDoc.paymentOrderId = rpOrder.id;
  await orderDoc.save();

  return res.status(201).json({
    razorpayOrder: rpOrder,
    order: orderDoc,
    keyId: config.razorpay.keyId,
  });
});

// Verify payment signature from client callback
router.post("/verify", authenticate, async (req: AuthRequest, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body as any;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
    return res.status(400).json({ message: "Missing parameters" });

  const hmac = crypto.createHmac("sha256", config.razorpay.keySecret);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const digest = hmac.digest("hex");
  const isValid = digest === razorpay_signature;

  if (!isValid) return res.status(400).json({ message: "Invalid signature" });

  const order = await Order.findOne({
    _id: orderId,
    paymentOrderId: razorpay_order_id,
  });
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.paymentId = razorpay_payment_id;
  order.paymentSignature = razorpay_signature;
  order.status = "paid";
  await order.save();

  // Fire-and-forget notifications; ignore failures
  try {
    await sendMail(
      "test@example.com",
      "Payment received",
      `<p>Your payment ${razorpay_payment_id} is successful for order ${order.id}</p>`
    );
  } catch {}
  try {
    await sendSms("+10000000000", `Payment received for order ${order.id}`);
  } catch {}

  return res.json({ ok: true, order });
});

// Webhook endpoint: requires raw body to verify
router.post("/webhook", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"] as string | undefined;
  if (!signature) return res.status(400).json({ message: "Missing signature" });

  const body = (req as any).rawBody as Buffer | undefined;
  if (!body) return res.status(400).json({ message: "Missing raw body" });

  const expected = crypto
    .createHmac("sha256", config.razorpay.webhookSecret)
    .update(body)
    .digest("hex");

  if (expected !== signature)
    return res.status(400).json({ message: "Invalid webhook signature" });

  const event = JSON.parse(body.toString());

  // Minimal handling demo
  if (event.event === "payment.captured") {
    const paymentId = event.payload.payment.entity.id as string;
    // Optionally reconcile with order by notes/order id
  }

  return res.json({ received: true });
});

export default router;
