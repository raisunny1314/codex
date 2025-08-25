const { createClient }=  require('redis');
require("dotenv").config();

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19750.c326.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 19750
    }
});

module.exports = redisClient;