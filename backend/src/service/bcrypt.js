//code by shantanav mukherjee written on 30/09/2026

const bcrypt = require("bcrypt");
const config = require("../config");

const hashPassword = async (password) => {
    if (password == null || password === undefined || password === "") {
        throw new Error("Password is required");
    }
    const salt = await bcrypt.genSalt(config.BCRYPT_SALT_ROUNDS);
    return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
    if (password == null || password === undefined || password === "") {
        throw new Error("Password is required");
    }
    return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
