import mongoose, { Schema, Document, Model } from "mongoose";

export type GroupOrderStatus =
  | "draft"
  | "open"
  | "closed"
  | "ordering"
  | "submitted"
  | "distributed";

export interface GroupOrderItem {
  productId: mongoose.Types.ObjectId;
  quantityGoal: number;
  unitPrice: number;
  variants?: { name: string; value: string }[];
}

export interface GroupOrderDocument extends Document {
  name: string;
  department?: string;
  createdBy: mongoose.Types.ObjectId;
  status: GroupOrderStatus;
  deadline?: Date; // ordering deadline
  note?: string;
  participants: mongoose.Types.ObjectId[]; // user ids
  products: GroupOrderItem[]; // New field
  uniqueCode: string; // New field
  collectedAmount: number; // New field
  totalQuantityCollected: number; // New field
}

const GroupOrderItemSchema = new Schema<GroupOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantityGoal: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    variants: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { _id: false }
);

const GroupOrderSchema = new Schema<GroupOrderDocument>(
  {
    name: { type: String, required: true, trim: true },
    department: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["draft", "open", "closed", "ordering", "submitted", "distributed"],
      default: "draft",
    },
    deadline: { type: Date },
    note: { type: String },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    products: { type: [GroupOrderItemSchema], required: true }, // New field
    uniqueCode: { type: String, unique: true, required: true }, // New field
    collectedAmount: { type: Number, default: 0 }, // New field
    totalQuantityCollected: { type: Number, default: 0 }, // New field
  },
  { timestamps: true }
);

GroupOrderSchema.index({ name: 1, createdBy: 1 }, { unique: false });

export const GroupOrder: Model<GroupOrderDocument> =
  mongoose.models.GroupOrder ||
  mongoose.model<GroupOrderDocument>("GroupOrder", GroupOrderSchema);