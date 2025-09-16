"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Distribution = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DistributionItemSchema = new mongoose_1.Schema({
    order: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: true },
    assignee: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed"],
        default: "pending",
    },
    notes: { type: String },
    pickupCode: { type: String },
    pickedUpAt: { type: Date },
}, { _id: false });
const DistributionSchema = new mongoose_1.Schema({
    groupOrder: { type: mongoose_1.Schema.Types.ObjectId, ref: "GroupOrder" },
    items: { type: [DistributionItemSchema], required: true },
    scheduledAt: { type: Date },
    completedAt: { type: Date },
}, { timestamps: true });
DistributionSchema.index({ "items.order": 1 });
exports.Distribution = mongoose_1.default.models.Distribution ||
    mongoose_1.default.model("Distribution", DistributionSchema);
//# sourceMappingURL=Distribution.js.map