import { Router } from "express";
import authRouter from "./routes.auth";
import usersRouter from "./routes.users";
import productsRouter from "./routes.products";
import ordersRouter from "./routes.orders";
import reviewsRouter from "./routes.reviews";
import groupsRouter from "./routes.groups";
import distributionRouter from "./routes.distribution";

const router = Router();

// TODO: attach sub-routers: /products, /orders, /reviews, /groups, /distribution, /users
router.get("/", (_req, res) => {
  res.json({ message: "API root" });
});

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/reviews", reviewsRouter);
router.use("/groups", groupsRouter);
router.use("/distribution", distributionRouter);

export default router;
