"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("./models/User");
const auth_1 = require("./middleware/auth");
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, department, role } = req.body;
        const existing = await User_1.User.findOne({ email });
        if (existing)
            return res.status(409).json({ message: "Email already in use" });
        const user = await User_1.User.create({ name, email, password, department, role });
        const token = (0, auth_1.signJwt)(user);
        return res.status(201).json({ token, user });
    }
    catch (err) {
        return res.status(400).json({ message: "Registration failed" });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.User.findOne({ email });
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    const ok = await user.comparePassword(password);
    if (!ok)
        return res.status(401).json({ message: "Invalid credentials" });
    const token = (0, auth_1.signJwt)(user);
    return res.json({ token, user });
});
exports.default = router;
//# sourceMappingURL=routes.auth.js.map