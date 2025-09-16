"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
async function start() {
    try {
        await mongoose_1.default.connect(config_1.config.mongoUri);
        // eslint-disable-next-line no-console
        console.log("Connected to MongoDB");
        app_1.default.listen(config_1.config.port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server running on http://localhost:${config_1.config.port}`);
        });
    }
    catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to start server", error);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map