//code by shantanav mukherjee written on 30/09/2026

const nodemailer = require("nodemailer");
const { redisClient } = require("./redis");
const config = require("../config");
const {
    generateOtp,
    hashOtp,
    createOtpPayload,
    evaluateOtpPresence,
    evaluateOtpAttempt,
    OTP_TTL_SECONDS,
} = require("./authRules");

function otpKey(email) {
    return `otp:${email}`;
}

function cooldownKey(email) {
    return `otp:cooldown:${email}`;
}

const RESEND_COOLDOWN_SECONDS = 60;

let transporter;

function getTransporter() {
    if (transporter) {
        return transporter;
    }

    const options = {
        host: config.SMTP_HOST,
        port: config.SMTP_PORT,
        secure: config.SMTP_SECURE,
        pool: true,
        maxConnections: 1,
        maxMessages: 50,
    };

    if (config.SMTP_USER) {
        options.auth = {
            user: config.SMTP_USER,
            pass: config.SMTP_PASS,
        };
    }

    transporter = nodemailer.createTransport(options);
    return transporter;
}

function queueOtpMail(email, otp) {
    getTransporter()
        .sendMail({
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
        })
        .catch((err) => {
            console.error("Failed to send OTP email:", err.message);
        });
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

    await redisClient.set(otpKey(email), JSON.stringify(createOtpPayload(otp)), {
        EX: OTP_TTL_SECONDS,
    });
    await redisClient.set(cooldownKey(email), "1", { EX: RESEND_COOLDOWN_SECONDS });

    queueOtpMail(email, otp);

    return { ok: true, email, true_otp: otp };
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
    const missing = evaluateOtpPresence(raw);
    if (missing) {
        return missing;
    }

    let payload;
    try {
        payload = JSON.parse(raw);
    } catch {
        return { ok: false, message: "Invalid OTP data" };
    }

    const result = evaluateOtpAttempt(payload, givenOtp);
    if (result.clear) {
        await redisClient.del(otpKey(email));
        return { ok: result.ok, message: result.message };
    }

    const ttl = await redisClient.ttl(otpKey(email));
    if (ttl > 0) {
        await redisClient.set(otpKey(email), JSON.stringify(result.payload), { EX: ttl });
    } else {
        await redisClient.set(otpKey(email), JSON.stringify(result.payload), {
            EX: OTP_TTL_SECONDS,
        });
    }

    return { ok: result.ok, message: result.message };
};

module.exports = {
    generateOtp,
    hashOtp,
    sendOtpEmail,
    resendOtpEmail,
    verifyOtp,
};
