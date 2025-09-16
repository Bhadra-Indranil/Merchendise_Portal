"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./middleware/auth");
const Distribution_1 = require("./models/Distribution");
const router = (0, express_1.Router)();
// Create a distribution batch (admin)
router.post("/", auth_1.authenticate, (0, auth_1.authorizeRoles)("admin"), async (req, res) => {
    const created = await Distribution_1.Distribution.create({ ...req.body });
    return res.status(201).json({ distribution: created });
});
// Update item status (admin)
router.patch("/:id/items/:index", auth_1.authenticate, (0, auth_1.authorizeRoles)("admin"), async (req, res) => {
    const dist = await Distribution_1.Distribution.findById(req.params.id);
    if (!dist)
        return res.status(404).json({ message: "Not found" });
    const idx = Number(req.params.index);
    if (Number.isNaN(idx) || idx < 0 || idx >= dist.items.length)
        return res.status(400).json({ message: "Bad index" });
    dist.items[idx] = { ...dist.items[idx], ...req.body };
    await dist.save();
    return res.json({ distribution: dist });
});
exports.default = router;
//# sourceMappingURL=routes.distribution.js.map