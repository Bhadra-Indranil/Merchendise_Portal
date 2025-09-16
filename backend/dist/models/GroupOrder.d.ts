import mongoose, { Document, Model } from "mongoose";
export type GroupOrderStatus = "draft" | "open" | "closed" | "ordering" | "submitted" | "distributed";
export interface GroupOrderDocument extends Document {
    name: string;
    department?: string;
    createdBy: mongoose.Types.ObjectId;
    status: GroupOrderStatus;
    deadline?: Date;
    note?: string;
    participants: mongoose.Types.ObjectId[];
}
export declare const GroupOrder: Model<GroupOrderDocument>;
//# sourceMappingURL=GroupOrder.d.ts.map