import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import routes from "./routes";
import paymentsRouter from "./routes.payments";

const app: Application = express();

app.use(cors());
app.use(morgan("dev"));
// Raw body for Razorpay webhook must be BEFORE express.json
app.post("/api/payments/webhook", express.raw({ type: "*/*" }), paymentsRouter);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);
app.use("/api/payments", paymentsRouter);

export default app;
