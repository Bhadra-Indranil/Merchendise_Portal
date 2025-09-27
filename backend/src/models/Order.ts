import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "fulfilled";

export interface OrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  customization?: { [key: string]: string };
}

export interface OrderDocument extends Document {
  user: mongoose.Types.ObjectId; // who placed
  groupOrder?: mongoose.Types.ObjectId; // optional parent group order
  items: OrderItem[];
  amount: number; // total amount
  status: OrderStatus;
  paymentProvider: "razorpay";
  paymentOrderId?: string; // Razorpay order id
  paymentId?: string; // Razorpay payment id
  paymentSignature?: string; // Razorpay signature
  shippingAddress?: string;
  notes?: string;
  trackingId?: string;
  estimatedDelivery?: Date;
  deliveryStatus?: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  statusHistory?: { status: string; timestamp: Date }[];
}

const OrderItemSchema = new Schema<OrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    customization: { type: Map, of: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<OrderDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    groupOrder: { type: Schema.Types.ObjectId, ref: "GroupOrder" },
    items: { type: [OrderItemSchema], required: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "fulfilled"],
      default: "pending",
    },
    paymentProvider: { type: String, enum: ["razorpay"], default: "razorpay" },
    paymentOrderId: { type: String },
    paymentId: { type: String },
    paymentSignature: { type: String },
    shippingAddress: { type: String },
    notes: { type: String },
    trackingId: { type: String, unique: true, sparse: true },
    estimatedDelivery: { type: Date },
    deliveryStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'],
      default: 'Processing',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });

export const Order: Model<OrderDocument> =
  mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema);
