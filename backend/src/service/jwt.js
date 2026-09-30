//code by shantanav mukherjee written on 30/09/2026

const jwt = require("jsonwebtoken");
const config = require("../config");

const generateToken = (userId) => {
    return jwt.sign({ userId }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, config.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken,
};
