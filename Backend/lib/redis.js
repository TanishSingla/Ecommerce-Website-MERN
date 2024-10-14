const Redis = require("ioredis"); // Importing ioredis
const dotenv = require('dotenv'); // Importing dotenv

dotenv.config(); // Loading environment variables

const redis = new Redis("rediss://default:AVdEAAIjcDE5YTVkYzZjY2QzY2U0ODM4YTA3MjVmM2MzYzE0ZjMwNHAxMA@teaching-eel-22340.upstash.io:6379"); // Creating a Redis client

module.exports = { redis }; // Exporting the redis client
