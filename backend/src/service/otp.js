//code by shantanav mukherjee written on 30/09/2026

const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { redisClient } = require("./redis");
const config = require("../config");

function generateOtp() {
    return String(crypto.randomInt(100000, 999999));
}

function hashOtp(otp) {
    return crypto.createHash("sha256").update(String(otp)).digest("hex");
}

function otpKey(email) {
    return `otp:${email}`;
}

function cooldownKey(email) {
    return `otp:cooldown:${email}`;
}

function createTransporter() {
    const options = {
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: config.SMTP_SECURE,
    };

    if (config.SMTP_USER) {
        options.auth = {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS,
        };
    }

    return nodemailer.createTransport(options);
}

async function sendOtpEmail(email) {
    email = email.toLowerCase().trim();

    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    const cooldown = await redisClient.get(cooldownKey(email));
    if (cooldown) {
        throw new Error("Email is on cooldown");
    }

    const otp = generateOtp();
    const transporter = createTransporter();


    const otpCachePayload = {
        otp: hashOtp(otp),
        attempts: 0,
    };
    await redisClient.set(otpKey(email), JSON.stringify(otpCachePayload), { EX: 10 * 60 });
    await redisClient.set(cooldownKey(email), "1", { EX: 60 });

    await transporter.sendMail({
        from: config.MAIL_FROM,
        to: email,
        subject: "Your verification code",
        text: `Your OTP is ${otp}. It expires in 10 minutes.`,
        html: `
          <h2>Email Verification</h2>
          <p>Your verification code is:</p>
          <h1>${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        `,
    });

    return { ok: true, email ,true_otp: otp};
}

const resendOtpEmail = async (email) => {
    if (!email || typeof email !== "string" || email.trim() === "") {
        throw new Error("Invalid email");
    }

    try {
        await sendOtpEmail(email);
        return { ok: true, message: "OTP resent successfully" };
    } catch (error) {
        if (error.message === "Email is on cooldown") {
            return { ok: false, message: "Please wait before requesting another code" };
        }
        throw error;
    }
};

const checkRedisConnection = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

const verifyOtp = async (email, givenOtp) => {
    await checkRedisConnection();
    const raw = await redisClient.get(otpKey(email));
    if (!raw) {
        return { ok: false, message: "OTP expired or not found" };
    }

    let payload;
    try {
        payload = JSON.parse(raw);
    } catch {
        return { ok: false, message: "Invalid OTP data" };
    }

    const hashedGiven = hashOtp(givenOtp);
    if (hashedGiven !== payload.otp) {
        const attempts = Number(payload.attempts || 0) + 1;
        if (attempts > 5) {
            await redisClient.del(otpKey(email));
            return { ok: false, message: "Too many attempts, please try again later" };
        }
        payload.attempts = attempts;
        const ttl = await redisClient.ttl(otpKey(email));
        if (ttl > 0) {
            await redisClient.set(otpKey(email), JSON.stringify(payload), { EX: ttl });
        } else {
            await redisClient.set(otpKey(email), JSON.stringify(payload), { EX: 10 * 60 });
        }
        if (attempts === 5) {
            return { ok: false, message: "This is your last attempt" };
        }
        return { ok: false, message: "Invalid OTP" };
    }

    await redisClient.del(otpKey(email));
    return { ok: true, message: "OTP verified successfully" };
};



module.exports = {
    generateOtp,
    hashOtp,
    sendOtpEmail,
    resendOtpEmail,
    verifyOtp,

};
