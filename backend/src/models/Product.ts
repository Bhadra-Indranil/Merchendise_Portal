import mongoose, { Schema, Document, Model } from "mongoose";

export interface ProductDocument extends Document {
  name: string;
  description?: string;
  category?: string;
  price: number;
  images: string[];
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const ProductSchema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, index: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 1, category: 1 }, { unique: false });

export const Product: Model<ProductDocument> =
  mongoose.models.Product ||
  mongoose.model<ProductDocument>("Product", ProductSchema);
