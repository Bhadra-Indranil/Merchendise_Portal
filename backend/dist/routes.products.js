"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./middleware/auth");
const Product_1 = require("./models/Product");
const router = (0, express_1.Router)();
// List products (public)
router.get("/", async (_req, res) => {
    const items = await Product_1.Product.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ items });
});
// Get product by id (public)
router.get("/:id", async (req, res) => {
    const item = await Product_1.Product.findById(req.params.id);
    if (!item)
        return res.status(404).json({ message: "Not found" });
    return res.json({ item });
});
// Create product (admin)
router.post("/", auth_1.authenticate, (0, auth_1.authorizeRoles)("admin"), async (req, res) => {
    const created = await Product_1.Product.create({ ...req.body });
    return res.status(201).json({ item: created });
});
// Update product (admin)
router.put("/:id", auth_1.authenticate, (0, auth_1.authorizeRoles)("admin"), async (req, res) => {
    const updated = await Product_1.Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    if (!updated)
        return res.status(404).json({ message: "Not found" });
    return res.json({ item: updated });
});
// Toggle active (admin)
router.patch("/:id/active", auth_1.authenticate, (0, auth_1.authorizeRoles)("admin"), async (req, res) => {
    const updated = await Product_1.Product.findByIdAndUpdate(req.params.id, { isActive: !!req.body.isActive }, { new: true });
    if (!updated)
        return res.status(404).json({ message: "Not found" });
    return res.json({ item: updated });
});
exports.default = router;
//# sourceMappingURL=routes.products.js.map