//code by shantanav mukherjee written on 30/09/2026

const dotenv= require("dotenv").config();

const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 3003,

    DB_URL:
        process.env.DATABASE_URL ||
        "postgresql://dev_user:a_secure_dev_password@localhost:5432/dev_db",
    POSTGRES_HOST: process.env.POSTGRES_HOST || "localhost",
    POSTGRES_PORT: Number(process.env.POSTGRES_PORT) || 5432,
    POSTGRES_USER: process.env.POSTGRES_USER || "dev_user",
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "a_secure_dev_password",
    POSTGRES_DB: process.env.POSTGRES_DB || "dev_db",

    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

    JWT_SECRET: process.env.JWT_SECRET || "dev_jwt_secret_change_me",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",

    BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
};

const smtpUser = process.env.SMTP_USER || "";
const smtpPass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
const useMailpit = !smtpUser || !smtpPass;

if (useMailpit) {
    config.SMTP_HOST = process.env.MAILPIT_HOST || "mailpit";
    config.SMTP_PORT = Number(process.env.MAILPIT_PORT) || 1025;
    config.SMTP_SECURE = false;
    config.SMTP_USER = "";
    config.SMTP_PASS = "";
    config.MAIL_FROM = process.env.SMTP_MAIL_FROM || "otp@padosipro.local";
    config.USE_MAILPIT = true;
} else {
    config.SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
    config.SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    config.SMTP_SECURE = process.env.SMTP_SECURE === "true";
    config.SMTP_USER = smtpUser;
    config.SMTP_PASS = smtpPass;
    config.MAIL_FROM = process.env.SMTP_MAIL_FROM || smtpUser;
    config.USE_MAILPIT = false;
}

module.exports = config;
