//code by shantanav mukherjee written on 30/09/2026

const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    return jwt.sign({userId}, "secret_key",{expiresIn: "1h"});   

}

const verifyToken = (token) => {
    return jwt.verify(token, "secret_key");
}
