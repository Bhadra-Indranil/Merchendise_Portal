import { Document, Model } from "mongoose";
export type UserRole = "user" | "dept_head" | "admin";
export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    department?: string;
    role: UserRole;
    comparePassword(candidate: string): Promise<boolean>;
}
export declare const User: Model<UserDocument>;
//# sourceMappingURL=User.d.ts.map