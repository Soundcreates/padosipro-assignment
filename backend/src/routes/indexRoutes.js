//code by shantanav mukherjee written on 30/09/2026

const express = require("express");
const indexRouter = express.Router();
const authRouter = require("./authRoutes");

indexRouter.use("/auth", authRouter);

module.exports = indexRouter;
