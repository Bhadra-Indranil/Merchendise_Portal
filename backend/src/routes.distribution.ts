import { Router } from "express";
import { authenticate, authorizeRoles } from "./middleware/auth";
import { Distribution } from "./models/Distribution";

const router = Router();

// Create a distribution batch (admin)
router.post("/", authenticate, authorizeRoles("admin"), async (req, res) => {
  const created = await Distribution.create({ ...req.body });
  return res.status(201).json({ distribution: created });
});

// Update item status (admin)
router.patch(
  "/:id/items/:index",
  authenticate,
  authorizeRoles("admin"),
  async (req, res) => {
    const dist = await Distribution.findById(req.params.id);
    if (!dist) return res.status(404).json({ message: "Not found" });
    const idx = Number(req.params.index);
    if (Number.isNaN(idx) || idx < 0 || idx >= dist.items.length)
      return res.status(400).json({ message: "Bad index" });
    dist.items[idx] = { ...dist.items[idx], ...req.body } as any;
    await dist.save();
    return res.json({ distribution: dist });
  }
);

export default router;
