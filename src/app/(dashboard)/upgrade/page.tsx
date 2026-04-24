"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Sparkles, Shield, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingCard } from "@/components/payment/PricingCard";
import { useSession } from "next-auth/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const freeFeatures = [
  "Up to 3 active tasks",
  "Basic task management",
  "5 categories",
  "Email notifications",
  "Mobile access",
  "Basic support",
];

const premiumFeatures = [
  "Unlimited tasks",
  "Advanced task management",
  "Unlimited categories",
  "Priority email support",
  "Mobile access",
  "Advanced analytics",
  "Team collaboration",
  "Custom workflows",
  "API access",
  "24/7 Priority support",
  "Export data",
  "Custom branding",
];

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your premium subscription at any time. Your access will continue until the end of your billing period.",
  },
  {
    question: "Is there a free trial?",
    answer: "We offer a 14-day free trial for new premium users. No credit card required to start.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Absolutely! You can upgrade or downgrade your plan at any time from your settings page.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use Stripe for secure payment processing. Your payment information is never stored on our servers.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee if you're not satisfied with our premium features.",
  },
];

export default function UpgradePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState<string>("FREE");

  useEffect(() => {
    if (session?.user?.status) {
      setUserStatus(session.user.status);
    }
  }, [session]);

  const handleSubscribe = async (priceId: string) => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          successUrl: `${window.location.origin}/upgrade?success=true`,
          cancelUrl: `${window.location.origin}/upgrade?canceled=true`,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No URL returned");
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Portal error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 px-4 py-1.5 mb-4">
          <Zap className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Simple, Transparent Pricing
          </span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock powerful features and take your productivity to the next level.
          Start with a 14-day free trial, no commitment required.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
        <PricingCard
          name="Free"
          price={0}
          description="Perfect for getting started"
          features={freeFeatures}
          currentPlan={userStatus}
        />
        
        <PricingCard
          name="Premium"
          price={12}
          description="Unlock full potential"
          features={premiumFeatures}
          priceId={process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID}
          isPopular={true}
          currentPlan={userStatus}
          onSubscribe={handleSubscribe}
          onManageSubscription={handleManageSubscription}
        />
      </div>

      {/* Trust Badges */}
      <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 pt-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 text-emerald-500" />
          Secure SSL Encryption
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCard className="h-4 w-4 text-emerald-500" />
          Stripe Secure Payments
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-emerald-500" />
          30-Day Money Back Guarantee
        </div>
      </motion.div>

      {/* Features Comparison */}
      <motion.div variants={itemVariants} className="pt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">Everything you need to succeed</h2>
          <p className="text-muted-foreground mt-1">Plus many more features to boost your productivity</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-md text-center p-6">
            <div className="rounded-full bg-indigo-100 dark:bg-indigo-950 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold">Unlimited Tasks</h3>
            <p className="text-sm text-muted-foreground mt-1">No limits on tasks or projects</p>
          </Card>
          <Card className="border-0 shadow-md text-center p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-950 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold">Advanced Analytics</h3>
            <p className="text-sm text-muted-foreground mt-1">Deep insights into productivity</p>
          </Card>
          <Card className="border-0 shadow-md text-center p-6">
            <div className="rounded-full bg-emerald-100 dark:bg-emerald-950 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold">Team Collaboration</h3>
            <p className="text-sm text-muted-foreground mt-1">Work together seamlessly</p>
          </Card>
          <Card className="border-0 shadow-md text-center p-6">
            <div className="rounded-full bg-amber-100 dark:bg-amber-950 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Headphones className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold">24/7 Priority Support</h3>
            <p className="text-sm text-muted-foreground mt-1">Get help when you need it</p>
          </Card>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div variants={itemVariants} className="pt-8 border-t">
        <h2 className="text-2xl font-semibold text-center mb-6">Frequently Asked Questions</h2>
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Import missing icons
import { Users, TrendingUp, Headphones } from "lucide-react";