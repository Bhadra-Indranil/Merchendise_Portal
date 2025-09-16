import mongoose, { Schema, Document, Model } from "mongoose";

export type DistributionStatus =
  | 'Pending'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Completed';

export interface DistributionItem {
  order: mongoose.Types.ObjectId; // order to distribute
  assignee?: mongoose.Types.ObjectId; // staff/admin handling
  status: DistributionStatus;
  notes?: string;
  pickupCode?: string; // optional code to verify pickup
  pickedUpAt?: Date;
}

export interface DistributionDocument extends Document {
  groupOrder?: mongoose.Types.ObjectId; // optional: batch distribution linked to a group order
  items: DistributionItem[];
  scheduledAt?: Date;
  completedAt?: Date;
}

const DistributionItemSchema = new Schema<DistributionItem>(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: [
        'Pending',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Completed',
      ],
      default: "Pending",
    },
    notes: { type: String },
    pickupCode: { type: String },
    pickedUpAt: { type: Date },
  },
  { _id: false }
);

const DistributionSchema = new Schema<DistributionDocument>(
  {
    groupOrder: { type: Schema.Types.ObjectId, ref: "GroupOrder" },
    items: { type: [DistributionItemSchema], required: true },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

DistributionSchema.index({ "items.order": 1 });

export const Distribution: Model<DistributionDocument> =
  mongoose.models.Distribution ||
  mongoose.model<DistributionDocument>("Distribution", DistributionSchema);
