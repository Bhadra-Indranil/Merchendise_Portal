import mongoose, { Schema, Document, Model } from "mongoose";

export interface ReviewDocument extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number; // 1-5
  comment?: string;
  visibility: "public" | "admin"; // admin-only or public
}

const ReviewSchema = new Schema<ReviewDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    visibility: { type: String, enum: ["public", "admin"], default: "public" },
  },
  { timestamps: true }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

export const Review: Model<ReviewDocument> =
  mongoose.models.Review ||
  mongoose.model<ReviewDocument>("Review", ReviewSchema);
