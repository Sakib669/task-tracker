import { stripe } from "@/lib/stripe-server";
import { enqueueWebhookEvent } from "@/lib/queue";
import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    logger.error("Stripe Webhook: Missing Stripe signature header.");
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    logger.error(
      `Stripe Webhook: signature verification failed.`,
      err,
      message,
    );
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  logger.info(`Stripe Webhook: Received event type: ${event.type}`);

  // Enqueue the event for background processing
  try {
    await enqueueWebhookEvent(event);
    logger.info(`Stripe Webhook: Event ${event.type} enqueued successfully.`);
  } catch (queueError) {
    logger.error(
      `Stripe Webhook: Failed to enqueue event ${event.type}`,
      queueError,
    );
    return new Response("Failed to enqueue webhook", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};
