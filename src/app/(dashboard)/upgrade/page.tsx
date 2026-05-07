"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const freeFeatures = [
  "Up to 3 active tasks",
  "Basic task management",
  "5 categories",
  "Email notifications",
  "Mobile access",
];

const premiumFeatures = [
  "Unlimited tasks",
  "Advanced task management",
  "Unlimited categories",
  "Priority email support",
  "Advanced analytics",
  "Team collaboration",
  "Custom workflows",
  "API access",
  "24/7 Priority support",
];

export default function UpgradePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const userStatus = session?.user?.status || "FREE";
  const isPremium = userStatus === "PREMIUM";

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID }),
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    // Optional: Add customer portal later
    alert("Manage subscription feature coming soon");
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 px-4 py-1.5 mb-4">
          <Zap className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Simple, Transparent Pricing</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Upgrade to premium and unlock powerful features to boost your productivity.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <motion.div variants={itemVariants}>
          <Card className="relative h-full border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2">
                  <Zap className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                Free Plan
              </CardTitle>
              <CardDescription className="text-base">Perfect for getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full h-11" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Premium Plan */}
        <motion.div variants={itemVariants}>
          <Card className="relative h-full border-0 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 px-4 py-1">
                <Crown className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="pt-8">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                Premium Plan
              </CardTitle>
              <CardDescription className="text-base">Unlock full potential</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$12</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 gap-3">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isPremium ? (
                <Button onClick={handleManageSubscription} className="w-full h-11" variant="outline">
                  Manage Subscription
                </Button>
              ) : (
                <Button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Upgrade to Premium"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}