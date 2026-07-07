"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
let REDIS_URL;
// 1. Check for a full REDIS_URL first (Render, self-hosted, or Upstash ioredis string)
if (process.env.REDIS_URL) {
    REDIS_URL = process.env.REDIS_URL;
}
// 2. Fallback: construct from Upstash REST URL + Token
else if (process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
        let rawUrl = process.env.UPSTASH_REDIS_REST_URL;
        if (rawUrl.startsWith('"') && rawUrl.endsWith('"')) {
            rawUrl = rawUrl.slice(1, -1);
        }
        const url = new URL(rawUrl);
        const hostname = url.hostname; // e.g., "abc123.upstash.io"
        // Construct the ioredis-compatible string
        let token = process.env.UPSTASH_REDIS_REST_TOKEN;
        if (token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
        }
        REDIS_URL = `rediss://default:${token}@${hostname}:6379`;
    }
    catch (err) {
        console.error("Failed to parse UPSTASH_REDIS_REST_URL:", err);
    }
}
if (!REDIS_URL) {
    console.warn("Missing Redis connection string. Using dummy string for build.");
    REDIS_URL = "redis://dummy:6379";
}
// Singleton pattern for Redis instance
let redis;
if (REDIS_URL && REDIS_URL.includes('dummy')) {
    // Simple in-memory mock for development/build
    const mockStore = {};
    exports.redis = redis = {
        get: async (key) => mockStore[key] || null,
        set: async (key, value, mode, ttl) => {
            mockStore[key] = value;
            return 'OK';
        },
        // @ts-ignore - other methods not needed for current workers
    };
}
else {
    if (process.env.NODE_ENV === "production") {
        exports.redis = redis = new ioredis_1.default(REDIS_URL, { maxRetriesPerRequest: null });
    }
    else {
        if (!global._redis) {
            global._redis = new ioredis_1.default(REDIS_URL, { maxRetriesPerRequest: null });
        }
        exports.redis = redis = global._redis;
    }
}
