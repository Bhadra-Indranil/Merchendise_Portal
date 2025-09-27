import { Router } from "express";
import { authenticate, authorizeRoles, AuthRequest } from "./middleware/auth";
import { Order, OrderDocument } from "./models/Order";

const router = Router();

// Create an order (user)
router.post("/", authenticate, async (req: AuthRequest, res) => {
  const created = await Order.create({ ...req.body, user: req.user!.id });
  return res.status(201).json({ order: created });
});

// Get my orders
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const orders = await Order.find({ user: req.user!.id }).sort({
    createdAt: -1,
  });
  return res.json({ orders });
});

// Get all orders for a group order (admin)
router.get("/group/:groupOrderId", authenticate, authorizeRoles("admin"), async (req, res) => {
  const orders = await Order.find({ groupOrder: req.params.groupOrderId })
    .populate("user", "name email")
    .populate("items.product", "name");
  return res.json({ orders });
});

// Update order item customization (admin)
router.patch("/:orderId/items/:itemIndex", authenticate, authorizeRoles("admin"), async (req, res) => {
  const { customization } = req.body;
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const itemIndex = Number(req.params.itemIndex);
  if (isNaN(itemIndex) || itemIndex < 0 || itemIndex >= order.items.length) {
    return res.status(400).json({ message: "Invalid item index" });
  }

  const item = order.items[itemIndex];
  if (item) {
    item.customization = customization;
  }
  await order.save();
  return res.json({ order });
});

// Get order tracking info
router.get('/:id/track', authenticate, async (req: AuthRequest, res) => {
  try {
    const order = await Order.findById(req.params.id) as OrderDocument;

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // For now, just return the tracking fields from the order.
    // Later, we can add more logic here to build the tracking history.
    const trackingInfo = {
      trackingId: order.trackingId,
      estimatedDelivery: order.estimatedDelivery,
      deliveryStatus: order.deliveryStatus,
      statusHistory: order.statusHistory,
    };

    return res.json(trackingInfo);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get one order (owner)
router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Not found" });
  if (order.user.toString() !== req.user!.id)
    return res.status(403).json({ message: "Forbidden" });
  return res.json({ order });
});

export default router;