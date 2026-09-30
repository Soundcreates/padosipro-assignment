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

    await redisClient.set(otpKey(email), hashOtp(otp), { EX: 10 * 60 });
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

    return { ok: true, email };
}

module.exports = {
    generateOtp,
    hashOtp,
    sendOtpEmail,
};
