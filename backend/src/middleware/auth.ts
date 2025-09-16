import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { User, UserDocument, UserRole } from "../models/User";

export interface AuthRequest extends Request {
  user?: UserDocument;
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : undefined;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = jwt.verify(token, config.jwtSecret) as { id: string };
    void User.findById(payload.id)
      .then((user) => {
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        req.user = user;
        next();
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Auth error", err);
        return res.status(401).json({ message: "Unauthorized" });
      });
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function authorizeRoles(...allowed: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !allowed.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

export function signJwt(user: UserDocument) {
  return jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: "7d",
  });
}
