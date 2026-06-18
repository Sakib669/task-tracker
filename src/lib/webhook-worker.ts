import { Worker } from "bullmq";
import { redis } from "../lib/redis";
import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

const worker = new Worker(
  "webhook-processing",
  async (job) => {
    const { event } = job.data;
    logger.info(`Webhook job ${job.id} processing event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id;
        if (!userId) throw new Error("Missing client_reference_id");

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error(`User ${userId} not found`);

        await prisma.user.update({
          where: { id: userId },
          data: {
            status: "PREMIUM",
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
          },
        });
        logger.info(`User ${userId} upgraded to PREMIUM via webhook`);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { status: "FREE", stripeSubscriptionId: null },
        });
        logger.info(`User with customer ${customerId} downgraded to FREE`);
        break;
      }
      default:
        logger.warn(`Unhandled webhook event type: ${event.type}`);
    }
  },
  {
    connection: redis,
    concurrency: 10,
  },
);

worker.on("failed", (job, err) => {
  logger.error(`Webhook job ${job?.id} failed:`, err);
});

logger.info("Webhook Worker started");
