"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("./middleware/auth");
const router = (0, express_1.Router)();
router.get("/me", auth_1.authenticate, (req, res) => {
    // req.user is set by authenticate
    // @ts-ignore
    return res.json({ user: req.user });
});
router.get("/admin/ping", auth_1.authenticate, (0, auth_1.authorizeRoles)("admin"), (_req, res) => {
    return res.json({ ok: true });
});
exports.default = router;
//# sourceMappingURL=routes.users.js.map