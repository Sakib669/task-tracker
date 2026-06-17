import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe-server";
import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  let event;

  if (!signature) {
    logger.error("Stripe Webhook: Missing Stripe signature header.");
    return new Response("Missing Stripe signature", { status: 400 });
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error(`Stripe Webhook: signature verification failed.`, err, message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  logger.info(`Stripe Webhook: Received event type: ${event.type}`);

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.client_reference_id;
      logger.info(`Stripe Webhook: Processing checkout.session.completed for userId: ${userId}`);

      if (!userId) {
        logger.warn(`Stripe Webhook: checkout.session.completed event missing client_reference_id. Session ID: ${session.id}`);
        return new Response("Missing userId in client_reference_id", { status: 400 });
      }

      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          logger.error(`Stripe Webhook: User with ID ${userId} not found for checkout.session.completed.`);
          return new Response("User not found", { status: 404 });
        }

        await prisma.user.update({
          where: { id: userId },
          data: {
            status: "PREMIUM",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        });
        logger.info(`Stripe Webhook: User ${userId} updated to PREMIUM status.`);
      } catch (dbError) {
        logger.error(`Stripe Webhook: Failed to update user ${userId} to PREMIUM.`, dbError);
        return new Response(`Database Update Error for checkout.session.completed`, { status: 500 });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      logger.info(`Stripe Webhook: Processing customer.subscription.deleted for customerId: ${customerId}`);

      try {
        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: { status: "FREE", stripeSubscriptionId: null },
        });
        logger.info(`Stripe Webhook: User(s) with customerId ${customerId} updated to FREE status.`);
      } catch (dbError) {
        logger.error(`Stripe Webhook: Failed to update user(s) with customerId ${customerId} to FREE.`, dbError);
        return new Response(`Database Update Error for customer.subscription.deleted`, { status: 500 });
      }
      break;
    }
    default: {
      logger.warn(`Stripe Webhook: Unhandled event type ${event.type}`);
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};
