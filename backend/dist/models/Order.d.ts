import mongoose, { Document, Model } from "mongoose";
export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "fulfilled";
export interface OrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    unitPrice: number;
}
export interface OrderDocument extends Document {
    user: mongoose.Types.ObjectId;
    groupOrder?: mongoose.Types.ObjectId;
    items: OrderItem[];
    amount: number;
    status: OrderStatus;
    paymentProvider: "razorpay";
    paymentOrderId?: string;
    paymentId?: string;
    paymentSignature?: string;
    shippingAddress?: string;
    notes?: string;
}
export declare const Order: Model<OrderDocument>;
//# sourceMappingURL=Order.d.ts.map