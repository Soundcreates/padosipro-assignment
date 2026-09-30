//code by shantanav mukherjee written on 30/09/2026

const { pool } = require("./db");
const bcryptService = require("./bcrypt");
const jwtService = require("./jwt");
const redisClient = requirer("./redis");
const otpService = require("./otp");

const register = async (email, password) => {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
        throw new Error("User already exists");
    }
    
    const otpResult = await otpService.sendOtpEmail(email); //it self handles the ttl redis cache set 
    const verifyResult =await otpService.verifyOtp(email,otpResult,true_otp);
    if(!verifyResult.ok){
        return {ok:false, message: verifyResult.message};
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
    if(!user.isVerified){
        return {ok:false, message: "User is not verified, please verify your email and try logging in later"};
    }
    const isPasswordValid = await bcryptService.comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }

    const token = jwtService.generateToken(user.id);
    return {
        ok: true,
        user: {id: user.id, email: user.email, isVerified: user.isVerified},
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
