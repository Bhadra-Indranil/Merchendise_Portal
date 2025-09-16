import { Router } from "express";
import { authenticate, AuthRequest } from "./middleware/auth";
import { Review } from "./models/Review";

const router = Router();

// Create/update review for a product
router.post("/", authenticate, async (req: AuthRequest, res) => {
  const { product, rating, comment, visibility } = req.body as {
    product: string;
    rating: number;
    comment?: string;
    visibility?: "public" | "admin";
  };
  const review = await Review.findOneAndUpdate(
    { product, user: req.user!.id },
    { rating, comment, visibility },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return res.status(201).json({ review });
});

// List public reviews for a product
router.get("/product/:id", async (req, res) => {
  const items = await Review.find({
    product: req.params.id,
    visibility: "public",
  })
    .sort({ createdAt: -1 })
    .limit(50);
  return res.json({ items });
});

export default router;
