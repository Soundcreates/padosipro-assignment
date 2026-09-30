const indexRouter = requrie("express").Router();
const authRouter = require("./authRoutes");

indexRouter.use("/auth", authRouter);
