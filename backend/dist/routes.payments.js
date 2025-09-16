"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const auth_1 = require("./middleware/auth");
const config_1 = require("./config");
const Order_1 = require("./models/Order");
const email_1 = require("./services/email");
const sms_1 = require("./services/sms");
const router = (0, express_1.Router)();
const razorpay = new razorpay_1.default({
    key_id: config_1.config.razorpay.keyId,
    key_secret: config_1.config.razorpay.keySecret,
});
// Create Razorpay order for an Order document
router.post("/create-order", auth_1.authenticate, async (req, res) => {
    const { amount, currency = "INR", receipt, notes, items, } = req.body;
    if (!amount || amount <= 0)
        return res.status(400).json({ message: "Amount required" });
    // Create local order first
    const orderDoc = await Order_1.Order.create({
        user: req.user.id,
        items,
        amount,
        status: "pending",
        paymentProvider: "razorpay",
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
    return res
        .status(201)
        .json({
        razorpayOrder: rpOrder,
        order: orderDoc,
        keyId: config_1.config.razorpay.keyId,
    });
});
// Verify payment signature from client callback
router.post("/verify", auth_1.authenticate, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
        return res.status(400).json({ message: "Missing parameters" });
    const hmac = crypto_1.default.createHmac("sha256", config_1.config.razorpay.keySecret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const digest = hmac.digest("hex");
    const isValid = digest === razorpay_signature;
    if (!isValid)
        return res.status(400).json({ message: "Invalid signature" });
    const order = await Order_1.Order.findOne({
        _id: orderId,
        paymentOrderId: razorpay_order_id,
    });
    if (!order)
        return res.status(404).json({ message: "Order not found" });
    order.paymentId = razorpay_payment_id;
    order.paymentSignature = razorpay_signature;
    order.status = "paid";
    await order.save();
    // Fire-and-forget notifications; ignore failures
    try {
        await (0, email_1.sendMail)("test@example.com", "Payment received", `<p>Your payment ${razorpay_payment_id} is successful for order ${order.id}</p>`);
    }
    catch { }
    try {
        await (0, sms_1.sendSms)("+10000000000", `Payment received for order ${order.id}`);
    }
    catch { }
    return res.json({ ok: true, order });
});
// Webhook endpoint: requires raw body to verify
router.post("/webhook", async (req, res) => {
    const signature = req.headers["x-razorpay-signature"];
    if (!signature)
        return res.status(400).json({ message: "Missing signature" });
    const body = req.rawBody;
    if (!body)
        return res.status(400).json({ message: "Missing raw body" });
    const expected = crypto_1.default
        .createHmac("sha256", config_1.config.razorpay.webhookSecret)
        .update(body)
        .digest("hex");
    if (expected !== signature)
        return res.status(400).json({ message: "Invalid webhook signature" });
    const event = JSON.parse(body.toString());
    // Minimal handling demo
    if (event.event === "payment.captured") {
        const paymentId = event.payload.payment.entity.id;
        // Optionally reconcile with order by notes/order id
    }
    return res.json({ received: true });
});
exports.default = router;
//# sourceMappingURL=routes.payments.js.map