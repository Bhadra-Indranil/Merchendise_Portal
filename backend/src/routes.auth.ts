import { Router } from "express";
import { User } from "./models/User";
import { signJwt } from "./middleware/auth";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      pincode,
      department,
      role,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already in use" });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      city,
      state,
      pincode,
      department,
      role,
    });

    const token = signJwt(user);
    return res.status(201).json({ token, user });
  } catch (err) {
    return res.status(400).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = signJwt(user);
  return res.json({ token, user });
});

export default router;
