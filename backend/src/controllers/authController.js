//code by shantanav mukherjee written on 30/09/2026

const authService = require("../service/auth");
const otpService = requier("../service/otp");

const sanitizeUser = (user) => {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
};

const register = async (req, res) => {
    try {
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const password = typeof req.body.password === "string" ? req.body.password : "";

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        
        const result = await authService.register(email, password);
        return res.status(201).json({
            message: result.message,
            user: sanitizeUser(result.user),
        });
    } catch (error) {
        const status = error.message === "User already exists" ? 409 : 500;
        return res.status(status).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const password = typeof req.body.password === "string" ? req.body.password : "";

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const result = await authService.login(email, password);
        return res.status(200).json({
            message: result.message,
            token: result.token,
            user: sanitizeUser(result.user),
        });
    } catch (error) {
        const isAuthError =
            error.message === "User not found" ||
            error.message === "Invalid password" ||
            error.message === "Invalid credentials";
        return res.status(isAuthError ? 401 : 500).json({
            message: isAuthError ? "Invalid credentials" : error.message,
        });
    }
};

const me = async (req, res) => {
    try {
        const user = await authService.getUserById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user: sanitizeUser(user) });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    me,
};
