"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./middleware/auth");
const GroupOrder_1 = require("./models/GroupOrder");
const router = (0, express_1.Router)();
// Create a group order (dept_head or admin)
router.post("/", auth_1.authenticate, (0, auth_1.authorizeRoles)("dept_head", "admin"), async (req, res) => {
    const created = await GroupOrder_1.GroupOrder.create({
        ...req.body,
        createdBy: req.user.id,
    });
    return res.status(201).json({ group: created });
});
// List open groups (public)
router.get("/open", async (_req, res) => {
    const groups = await GroupOrder_1.GroupOrder.find({
        status: { $in: ["open", "ordering"] },
    }).sort({ createdAt: -1 });
    return res.json({ groups });
});
// Update status (dept_head/admin)
router.patch("/:id/status", auth_1.authenticate, (0, auth_1.authorizeRoles)("dept_head", "admin"), async (req, res) => {
    const updated = await GroupOrder_1.GroupOrder.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!updated)
        return res.status(404).json({ message: "Not found" });
    return res.json({ group: updated });
});
exports.default = router;
//# sourceMappingURL=routes.groups.js.map