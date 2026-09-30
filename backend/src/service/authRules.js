const crypto = require("crypto");

const OTP_MIN = 100000;
const OTP_MAX = 999999;
const MAX_ATTEMPTS = 5;
const OTP_TTL_SECONDS = 10 * 60;

function generateOtp() {
    return String(crypto.randomInt(OTP_MIN, OTP_MAX));
}

function hashOtp(otp) {
    return crypto.createHash("sha256").update(String(otp)).digest("hex");
}

function isSixDigitOtp(otp) {
    return typeof otp === "string" && /^\d{6}$/.test(otp);
}

function createOtpPayload(otp) {
    return {
        otp: hashOtp(otp),
        attempts: 0,
    };
}

function evaluateOtpPresence(raw) {
    if (!raw) {
        return { ok: false, message: "OTP expired or not found" };
    }
    return null;
}

function evaluateOtpAttempt(payload, givenOtp) {
    const hashedGiven = hashOtp(givenOtp);
    if (hashedGiven === payload.otp) {
        return {
            ok: true,
            message: "OTP verified successfully",
            clear: true,
            payload: null,
        };
    }

    const attempts = Number(payload.attempts || 0) + 1;
    if (attempts > MAX_ATTEMPTS) {
        return {
            ok: false,
            message: "Too many attempts, please try again later",
            clear: true,
            payload: null,
        };
    }

    const nextPayload = { ...payload, attempts };
    if (attempts === MAX_ATTEMPTS) {
        return {
            ok: false,
            message: "This is your last attempt",
            clear: false,
            payload: nextPayload,
        };
    }

    return {
        ok: false,
        message: "Invalid OTP",
        clear: false,
        payload: nextPayload,
    };
}

function evaluateLogin({ user, isPasswordValid }) {
    if (!user || !isPasswordValid) {
        return {
            ok: false,
            error: "Invalid credentials",
            needsVerification: false,
        };
    }

    if (!user.is_verified) {
        return {
            ok: false,
            needsVerification: true,
            message: "Please verify your email to continue",
        };
    }

    return {
        ok: true,
        user,
    };
}

module.exports = {
    OTP_MIN,
    OTP_MAX,
    MAX_ATTEMPTS,
    OTP_TTL_SECONDS,
    generateOtp,
    hashOtp,
    isSixDigitOtp,
    createOtpPayload,
    evaluateOtpPresence,
    evaluateOtpAttempt,
    evaluateLogin,
};
