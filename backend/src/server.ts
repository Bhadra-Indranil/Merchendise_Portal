import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";

async function start() {
  try {
    await mongoose.connect(config.mongoUri);
    // eslint-disable-next-line no-console
    console.log("Connected to MongoDB");

    // Don't start listening here for Vercel
    if (process.env.NODE_ENV !== 'production') {
      app.listen(config.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on http://localhost:${config.port}`);
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

start();

export default app;
