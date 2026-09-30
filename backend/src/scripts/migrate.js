//code by shantanav mukherjee written on 30/09/2026

const { pool } = require("../service/db");
const { createUsersTableSQL } = require("../schemas/user");

const migrate = async () => {
    const client = await pool.connect();
    try {
        await client.query(createUsersTableSQL);
        console.log("Migration complete: users table is ready");
    } catch (error) {
        console.error("Migration failed", error);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
};

migrate();
