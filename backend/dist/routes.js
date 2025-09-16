"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_auth_1 = __importDefault(require("./routes.auth"));
const routes_users_1 = __importDefault(require("./routes.users"));
const routes_products_1 = __importDefault(require("./routes.products"));
const routes_orders_1 = __importDefault(require("./routes.orders"));
const routes_reviews_1 = __importDefault(require("./routes.reviews"));
const routes_groups_1 = __importDefault(require("./routes.groups"));
const routes_distribution_1 = __importDefault(require("./routes.distribution"));
const router = (0, express_1.Router)();
// TODO: attach sub-routers: /products, /orders, /reviews, /groups, /distribution, /users
router.get("/", (_req, res) => {
    res.json({ message: "API root" });
});
router.use("/auth", routes_auth_1.default);
router.use("/users", routes_users_1.default);
router.use("/products", routes_products_1.default);
router.use("/orders", routes_orders_1.default);
router.use("/reviews", routes_reviews_1.default);
router.use("/groups", routes_groups_1.default);
router.use("/distribution", routes_distribution_1.default);
exports.default = router;
//# sourceMappingURL=routes.js.map