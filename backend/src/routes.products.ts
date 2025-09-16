import { Router } from "express";
import { authenticate, authorizeRoles } from "./middleware/auth";
import { Product } from "./models/Product";

const router = Router();

// List products (public)
router.get("/", async (_req, res) => {
  const items = await Product.find({ isActive: true }).sort({ createdAt: -1 });
  return res.json({ items });
});

// Get product by id (public)
router.get("/:id", async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  return res.json({ item });
});

// Create product (admin)
router.post("/", authenticate, authorizeRoles("admin"), async (req, res) => {
  const created = await Product.create({ ...req.body });
  return res.status(201).json({ item: created });
});

// Update product (admin)
router.put("/:id", authenticate, authorizeRoles("admin"), async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: "Not found" });
  return res.json({ item: updated });
});

// Toggle active (admin)
router.patch(
  "/:id/active",
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: !!req.body.isActive },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json({ item: updated });
  }
);

export default router;
