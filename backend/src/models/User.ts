import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "user" | "dept_head" | "admin";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  department?: string;
  role: UserRole;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    department: { type: String },
    role: {
      type: String,
      enum: ["user", "dept_head", "admin"],
      default: "user",
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const doc = this as UserDocument;
  if (!doc.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  doc.password = await bcrypt.hash(doc.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete (ret as any).password;
    return ret;
  },
});

export const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
