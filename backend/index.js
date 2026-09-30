//code by shantanav mukherjee written on 30/09/2026

const express = require("express");
const cors =require("cors");
const dotenv =require("dotenv").config();

const { connectDB } = require("./src/service/db");
const indexRouter = require("./src/routes/indexRoutes");
const app = express();

const corsOptions = {
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", indexRouter);

const PORT = 3003;

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});
