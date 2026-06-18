import { Worker } from "bullmq";
import { redis } from "./redis";
import { prisma } from "./prisma";
import { generateTasks } from "../app/actions/ait";
import { logger } from "./logger";

const worker = new Worker(
  "ai-generation",
  async (job) => {
    const { goal, userId } = job.data;
    logger.info(`AI job ${job.id} started for user ${userId}`);

    const result = await generateTasks(goal);
    if (result.error) {
      throw new Error(result.error);
    }

    if (result.tasks && result.tasks.length > 0) {
      await prisma.task.createMany({
        data: result.tasks.map((task) => ({
          ...task,
          userId,
          status: "pending",
          isCompleted: false,
        })),
      });
      logger.info(`AI job ${job.id} created ${result.tasks.length} tasks`);
    }

    // Store result in Redis for polling (status: done)
    await redis.set(
      `job:${job.id}`,
      JSON.stringify({ status: "done" }),
      "EX",
      3600,
    );
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

worker.on("failed", (job, err) => {
  logger.error(`AI job ${job?.id} failed:`, err);
  if (job) {
    redis.set(
      `job:${job.id}`,
      JSON.stringify({ status: "failed", error: err.message }),
      "EX",
      3600,
    );
  }
});

logger.info("AI Worker started");
