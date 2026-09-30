//code by shantanav mukherjee written on 30/09/2026

const redis = require("redis");
const config = require("../config");

const redisClient = redis.createClient({
    url: config.REDIS_URL,
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    console.log("Redis connected");
}

module.exports = {
    connectRedis,
    redisClient,
};
