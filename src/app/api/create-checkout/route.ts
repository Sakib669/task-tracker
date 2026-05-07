import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe-server";
import { auth } from "../../../../auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email!,
      client_reference_id: session.user.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "TaskFlow Premium Plan",
              description: "Unlock unlimited tasks and premium features",
            },
            unit_amount: 1200, 
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
    
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}