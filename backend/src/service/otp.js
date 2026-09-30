//code by shantanav mukherjee written on 30/09/2026

const bcrypt =require("bcrypt");
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


    //i think will be putting a payload object in the otpkey cache , cuz it will be better
    const otpCachePayload = {
        otp: await hashOtp(otp),
        attempts: 0,
    };
    await redisClient.set(otpKey(email),  otpCachePayload, { EX: 10 * 60 });
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
    if(!email || typeof email !== "string" || email.trim() ==="") {
        throw new Error("Invalid email");
    }
    
    if(!redisClient.isOpen){
        await redisClient.connectRedis();
    }
    const cooldown = await redisClient.get(cooldownKey(email));
    if(cooldown || cooldown > 0){
        return {ok: false, message: "Email is on cooldown"};
    }
    await sendOtpEmail(email);
    return {ok: true, message: "OTP resent successfully"};



}

const checkRedisConnection = async () => {
    if(!redisClient.isOpen){
        await redisClient.connectRedis();
    }
}
const verifyOtp = async (email, givenOtp) => {
    await checkRedisConnection();
    const hashedOtp = await redisClient.get(otpKey(email).otp);
    if(!compareOtp(givenOtp,hashedOtp)){
        const attempts = await redisClient.get(otpKey(email).attempts);
        if(attempts==5){
            return {ok: false, message: "This is your last attempt"};
        }
        if(attempts > 5) {
            return {ok: false, message: "Too many attempts, please try again later"};
        }
        await redisClient.set(otpKey(email).attempts, attempts+1,{keepttl:true}); 
        return  {ok: false, message: "Invalid OTP"};       
    }
    await redisClient.del(otpKey(email));
    return {ok: true, message: "OTP verified successfully"};
}



module.exports = {
    generateOtp,
    hashOtp,
    sendOtpEmail,
    resendOtpEmail,
    verifyOtp,

};
