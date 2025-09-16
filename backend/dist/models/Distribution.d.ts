import mongoose, { Document, Model } from "mongoose";
export type DistributionStatus = "pending" | "in_progress" | "completed";
export interface DistributionItem {
    order: mongoose.Types.ObjectId;
    assignee?: mongoose.Types.ObjectId;
    status: DistributionStatus;
    notes?: string;
    pickupCode?: string;
    pickedUpAt?: Date;
}
export interface DistributionDocument extends Document {
    groupOrder?: mongoose.Types.ObjectId;
    items: DistributionItem[];
    scheduledAt?: Date;
    completedAt?: Date;
}
export declare const Distribution: Model<DistributionDocument>;
//# sourceMappingURL=Distribution.d.ts.map