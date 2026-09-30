//code by shantanv mukherjee written on 30/09/2026

const { sendOtpEmail } = require("../service/otp");
const { redisClient } = require("../service/redis");

const sendMail = async () => {
    const email = process.argv[2] || "shantanav7@gmail.com";

    try {
        await sendOtpEmail(email);
        console.log("Email sent to:", email);
    } catch (err) {
        console.error("Error sending email:", err.message);
        process.exitCode = 1;
    } finally {
        if (redisClient.isOpen) {
            await redisClient.quit();
        }
    }
};

sendMail();
