import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe-server";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  let event;

  if (!signature) {
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
    console.log(`Webhook signature verification failed.`, message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.client_reference_id;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            status: "PREMIUM",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { status: "FREE", stripeSubscriptionId: null },
      });
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};
