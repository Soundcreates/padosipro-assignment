//code by shantanav mukherjee written on 30/09/2026

const express = require("express");
const indexRouter = express.Router();
const authRouter = require("./authRoutes");

indexRouter.get("/health", (_req, res) => {
    return res.status(200).json({ ok: true });
});

indexRouter.use("/auth", authRouter);

module.exports = indexRouter;
