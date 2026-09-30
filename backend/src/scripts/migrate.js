//code by shantanav mukherjee written on 30/09/2026

const { pool } = require("../service/db");
const { createUsersTableSQL, alterUsersTableSQL } = require("../schemas/user");

const migrate = async () => {
    const client = await pool.connect();
    try {
        await client.query(createUsersTableSQL);
        await client.query(alterUsersTableSQL);
        console.log("Migration complete: users table is ready");
    } catch (error) {
        console.error("Migration failed", error);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { migrate };
