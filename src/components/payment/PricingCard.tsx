"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { stripe } from "@/lib/stripe-server";

interface PricingCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  priceId?: string;
  isPopular?: boolean;
  currentPlan?: string;
  onSubscribe?: (priceId: string) => void;
  onManageSubscription?: () => void;
}

export async function PricingCard({
  name,
  price,
  description,
  features,
  priceId,
  isPopular,
  currentPlan,
  onSubscribe,
  onManageSubscription,
}: PricingCardProps) {
  const isCurrentPlan = currentPlan?.toLowerCase() === name.toLowerCase();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isCurrentPlan && onManageSubscription) {
      onManageSubscription();
    } else if (onSubscribe && priceId) {
      setIsLoading(true);
      await onSubscribe(priceId);
      setIsLoading(false);
    }
  };

  // Create PaymentIntent as soon as the page loads
  const { client_secret: clientSecret } = await stripe.paymentIntents.create({
    amount: 12,
    currency: 'usd',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Card className={`relative h-full border-0 shadow-xl overflow-hidden ${isPopular ? "ring-2 ring-indigo-500" : ""}`}>
        {isPopular && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 px-4 py-1">
              <Crown className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
        )}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${isPopular ? "from-indigo-500 to-purple-600" : "from-slate-500 to-slate-600"}`} />
        
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className={`rounded-xl p-2 ${isPopular ? "bg-gradient-to-br from-indigo-500 to-purple-600" : "bg-slate-100 dark:bg-slate-800"}`}>
              {name === "Premium" ? (
                <Sparkles className={`h-5 w-5 ${isPopular ? "text-white" : "text-slate-600"}`} />
              ) : (
                <Zap className={`h-5 w-5 ${isPopular ? "text-white" : "text-slate-600"}`} />
              )}
            </div>
            {name}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
          <div className="mt-4">
            {price === 0 ? (
              <span className="text-4xl font-bold">Free</span>
            ) : (
              <>
                <span className="text-4xl font-bold">${price}</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        
        <CardFooter>
          <Button
            onClick={handleClick}
            disabled={isLoading}
            className={`w-full h-11 ${
              isCurrentPlan
                ? "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300"
                : isPopular
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                : ""
            }`}
            variant={!isPopular && !isCurrentPlan ? "outline" : "default"}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading...
              </span>
            ) : isCurrentPlan ? (
              "Manage Subscription"
            ) : price === 0 ? (
              "Current Plan"
            ) : (
              `Subscribe to ${name}`
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}