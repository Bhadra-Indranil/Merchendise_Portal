"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./middleware/auth");
const Order_1 = require("./models/Order");
const router = (0, express_1.Router)();
// Create an order (user)
router.post("/", auth_1.authenticate, async (req, res) => {
    const created = await Order_1.Order.create({ ...req.body, user: req.user.id });
    return res.status(201).json({ order: created });
});
// Get my orders
router.get("/me", auth_1.authenticate, async (req, res) => {
    const orders = await Order_1.Order.find({ user: req.user.id }).sort({
        createdAt: -1,
    });
    return res.json({ orders });
});
// Get one order (owner)
router.get("/:id", auth_1.authenticate, async (req, res) => {
    const order = await Order_1.Order.findById(req.params.id);
    if (!order)
        return res.status(404).json({ message: "Not found" });
    if (order.user.toString() !== req.user.id)
        return res.status(403).json({ message: "Forbidden" });
    return res.json({ order });
});
exports.default = router;
//# sourceMappingURL=routes.orders.js.map