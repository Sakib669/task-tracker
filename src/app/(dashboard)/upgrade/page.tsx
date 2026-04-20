"use client"

import { motion } from "framer-motion"
import { Check, Zap, Crown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

const freeFeatures = [
  "Up to 3 active tasks",
  "Basic task management",
  "5 categories",
  "Email notifications",
  "Mobile access",
]

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
  "Priority support",
]

export default function UpgradePage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Upgrade Your Plan</h1>
        <p className="mt-2 text-muted-foreground">
          Choose the plan that best fits your needs. Upgrade anytime to unlock more features.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <motion.div variants={itemVariants}>
          <Card className="relative h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Free Plan
              </CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Premium Plan */}
        <motion.div variants={itemVariants}>
          <Card className="relative h-full border-primary shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                <Crown className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                Premium Plan
              </CardTitle>
              <CardDescription>Unlock full potential</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$12</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {premiumFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                  <Zap className="h-4 w-4 mr-2" />
                  Go Premium
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* FAQ Section */}
      <motion.div variants={itemVariants} className="max-w-2xl mx-auto pt-8">
        <h2 className="text-xl font-semibold text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your premium subscription at any time. Your access will continue until the end of your billing period.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Is there a free trial?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 14-day free trial for new premium users. No credit card required to start.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  )
}