"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    // if token null return 401
    if (token == null)
        return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.status(403);
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
