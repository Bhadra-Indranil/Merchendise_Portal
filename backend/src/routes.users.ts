import { Router } from "express";
import { authenticate, authorizeRoles } from "./middleware/auth";

const router = Router();

router.get("/me", authenticate, (req, res) => {
  // req.user is set by authenticate
  // @ts-ignore
  return res.json({ user: req.user });
});

router.get(
  "/admin/ping",
  authenticate,
  authorizeRoles("admin"),
  (_req, res) => {
    return res.json({ ok: true });
  }
);

export default router;
