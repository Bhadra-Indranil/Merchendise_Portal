"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = __importDefault(require("./routes"));
const routes_payments_1 = __importDefault(require("./routes.payments"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
// Raw body for Razorpay webhook must be BEFORE express.json
app.post("/api/payments/webhook", express_1.default.raw({ type: "*/*" }), routes_payments_1.default);
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/api", routes_1.default);
app.use("/api/payments", routes_payments_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map