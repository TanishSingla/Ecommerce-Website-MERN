import Redis from "ioredis"
import dotenv from 'dotenv';

dotenv.config();

export const redis = new Redis("rediss://default:AVdEAAIjcDE5YTVkYzZjY2QzY2U0ODM4YTA3MjVmM2MzYzE0ZjMwNHAxMA@teaching-eel-22340.upstash.io:6379");
