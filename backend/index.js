//code by shantanav mukherjee written on 30/09/2026

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { migrate } = require("./src/scripts/migrate");
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

const PORT = Number(process.env.PORT) || 3003;

async function start() {
    await connectDB();
    await migrate();
    console.log("Database connected and migrations are completed");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

start().catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
});
