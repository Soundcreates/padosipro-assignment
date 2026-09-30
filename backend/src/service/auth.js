//code by shantanav mukherjee written on 30/09/2026

const { pool } = require("./db");
const bcryptService = require("./bcrypt");
const jwtService = require("./jwt");
const otpService = require("./otp");
const { evaluateLogin } = require("./authRules");

const register = async (email, password) => {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
        throw new Error("User already exists");
    }

    const otpResult = await otpService.sendOtpEmail(email);
    if (!otpResult.ok) {
        return { ok: false, message: "Failed to send OTP" };
    }

    const hashedPassword = await bcryptService.hashPassword(password);
    const result = await pool.query(
        "INSERT INTO users (email, password, is_verified) VALUES ($1, $2, FALSE) RETURNING *",
        [email, hashedPassword]
    );

    return {
        ok: true,
        user: result.rows[0],
        message: "User registered",
    };
};

const login = async (email, password) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    const isPasswordValid = user
        ? await bcryptService.comparePassword(password, user.password)
        : false;

    const decision = evaluateLogin({ user, isPasswordValid });
    if (!decision.ok) {
        if (decision.needsVerification) {
            try {
                await otpService.sendOtpEmail(email);
            } catch (error) {
                if (error.message !== "Email is on cooldown") {
                    throw error;
                }
            }
            return {
                ok: false,
                needsVerification: true,
                message: decision.message,
            };
        }
        throw new Error(decision.error);
    }

    const token = jwtService.generateToken(user.id);
    return {
        ok: true,
        user: { id: user.id, email: user.email, isVerified: user.is_verified },
        token,
        message: "Login successful",
    };
};

const getUserById = async (userId) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    return result.rows[0] || null;
};

const markEmailVerified = async (email) => {
    const result = await pool.query(
        "UPDATE users SET is_verified = TRUE WHERE email = $1 RETURNING id, email, is_verified",
        [email]
    );
    return result.rows[0] || null;
};

module.exports = {
    register,
    login,
    getUserById,
    markEmailVerified,
};
