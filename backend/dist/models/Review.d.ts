import mongoose, { Document, Model } from "mongoose";
export interface ReviewDocument extends Document {
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    visibility: "public" | "admin";
}
export declare const Review: Model<ReviewDocument>;
//# sourceMappingURL=Review.d.ts.map