const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.POSTGRES_USER || "dev_user",
    password: process.env.POSTGRES_PASSWORD || "a_secure_dev_password",
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DB || "dev_db",
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        client.release();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database", error);
        process.exit(1);
    }
};

module.exports = { connectDB, pool };
