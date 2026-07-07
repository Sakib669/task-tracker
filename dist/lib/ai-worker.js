"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bullmq_1 = require("bullmq");
const redis_1 = require("./redis");
const prisma_1 = require("./prisma");
const ait_1 = require("../app/actions/ait");
const logger_1 = require("./logger");
const worker = new bullmq_1.Worker("ai-generation", async (job) => {
    const { goal, userId } = job.data;
    logger_1.logger.info(`AI job ${job.id} started for user ${userId}`);
    const result = await (0, ait_1.generateTasks)(goal);
    if (result.error) {
        throw new Error(result.error);
    }
    if (result.tasks && result.tasks.length > 0) {
        await prisma_1.prisma.task.createMany({
            data: result.tasks.map((task) => (Object.assign(Object.assign({}, task), { userId, status: "pending", isCompleted: false }))),
        });
        logger_1.logger.info(`AI job ${job.id} created ${result.tasks.length} tasks`);
    }
    // ✅ Use prefixed key for AI job status
    await redis_1.redis.set(`job:ai:${job.id}`, JSON.stringify({ status: "done" }), "EX", 3600);
}, {
    connection: redis_1.redis,
    concurrency: 5,
});
worker.on("failed", (job, err) => {
    logger_1.logger.error(`AI job ${job === null || job === void 0 ? void 0 : job.id} failed:`, err);
    if (job) {
        redis_1.redis.set(`job:ai:${job.id}`, JSON.stringify({ status: "failed", error: err.message }), "EX", 3600);
    }
});
logger_1.logger.info("AI Worker started");
