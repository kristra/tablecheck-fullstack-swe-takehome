// lib/redis.ts
import Redis from "ioredis";

// Redis configuration
const redis = new Redis({
  host: "localhost", // Redis server URL
  port: 6379, // Redis server port
  maxRetriesPerRequest: null,
});

export { redis };
