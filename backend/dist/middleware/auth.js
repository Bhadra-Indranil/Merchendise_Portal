"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorizeRoles = authorizeRoles;
exports.signJwt = signJwt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const User_1 = require("../models/User");
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : undefined;
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const payload = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        void User_1.User.findById(payload.id)
            .then((user) => {
            if (!user)
                return res.status(401).json({ message: "Unauthorized" });
            req.user = user;
            next();
        })
            .catch((err) => {
            // eslint-disable-next-line no-console
            console.error("Auth error", err);
            return res.status(401).json({ message: "Unauthorized" });
        });
    }
    catch {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
function authorizeRoles(...allowed) {
    return (req, res, next) => {
        const role = req.user?.role;
        if (!role || !allowed.includes(role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}
function signJwt(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, config_1.config.jwtSecret, {
        expiresIn: "7d",
    });
}
//# sourceMappingURL=auth.js.map