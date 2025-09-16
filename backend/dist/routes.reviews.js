"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./middleware/auth");
const Review_1 = require("./models/Review");
const router = (0, express_1.Router)();
// Create/update review for a product
router.post("/", auth_1.authenticate, async (req, res) => {
    const { product, rating, comment, visibility } = req.body;
    const review = await Review_1.Review.findOneAndUpdate({ product, user: req.user.id }, { rating, comment, visibility }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return res.status(201).json({ review });
});
// List public reviews for a product
router.get("/product/:id", async (req, res) => {
    const items = await Review_1.Review.find({
        product: req.params.id,
        visibility: "public",
    })
        .sort({ createdAt: -1 })
        .limit(50);
    return res.json({ items });
});
exports.default = router;
//# sourceMappingURL=routes.reviews.js.map