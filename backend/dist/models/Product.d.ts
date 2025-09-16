import mongoose, { Document, Model } from "mongoose";
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
export declare const Product: Model<ProductDocument>;
//# sourceMappingURL=Product.d.ts.map