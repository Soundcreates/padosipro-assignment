//code by shantanav mukherjee written on 30/09/2026

const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/resend-otp", authController.resendOtp);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.get("/me", authenticate, authController.me);

module.exports = authRouter;
