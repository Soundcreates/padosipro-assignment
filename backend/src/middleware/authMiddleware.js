//code by shantanav mukherjee written on 30/09/2026

const jwtService = require("../service/jwt");

const authenticate = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token required" });
        }

        const token = header.slice(7).trim();
        if (!token) {
            return res.status(401).json({ message: "Authorization token required" });
        }

        const payload = jwtService.verifyToken(token);
        req.userId = payload.userId;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    authenticate,
};
