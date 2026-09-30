//code by shantanav mukherjee written on 30/09/2026

const { pool } = require("./db");
const bcryptService = require("./bcrypt");
const jwtService = require("./jwt");

const register = async (email, password) => {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcryptService.hashPassword(password);
    const result = await pool.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
        [email, hashedPassword]
    );

    return {
        user: result.rows[0],
        message: "User registered",
    };
};

const login = async (email, password) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcryptService.comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const token = jwtService.generateToken(user.id);
    return {
        user,
        token,
        message: "Login successful",
    };
};

const getUserById = async (userId) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
    return result.rows[0] || null;
};

module.exports = {
    register,
    login,
    getUserById,
};
