"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bullmq_1 = require("bullmq");
const redis_1 = require("./redis");
const prisma_1 = require("./prisma");
const logger_1 = require("./logger");
const worker = new bullmq_1.Worker("webhook-processing", async (job) => {
    const { event } = job.data;
    logger_1.logger.info(`Webhook job ${job.id} processing event: ${event.type}`);
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            const userId = session.client_reference_id;
            if (!userId)
                throw new Error("Missing client_reference_id");
            const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new Error(`User ${userId} not found`);
            await prisma_1.prisma.user.update({
                where: { id: userId },
                data: {
                    status: "PREMIUM",
                    stripeCustomerId: session.customer,
                    stripeSubscriptionId: session.subscription,
                },
            });
            logger_1.logger.info(`User ${userId} upgraded to PREMIUM via webhook`);
            break;
        }
        case "customer.subscription.deleted": {
            const subscription = event.data.object;
            const customerId = subscription.customer;
            await prisma_1.prisma.user.updateMany({
                where: { stripeCustomerId: customerId },
                data: { status: "FREE", stripeSubscriptionId: null },
            });
            logger_1.logger.info(`User with customer ${customerId} downgraded to FREE`);
            break;
        }
        default:
            logger_1.logger.warn(`Unhandled webhook event type: ${event.type}`);
    }
}, {
    connection: redis_1.redis,
    concurrency: 10,
});
worker.on("failed", (job, err) => {
    logger_1.logger.error(`Webhook job ${job === null || job === void 0 ? void 0 : job.id} failed:`, err);
});
logger_1.logger.info("Webhook Worker started");
