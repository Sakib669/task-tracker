"use client"

import { motion } from "framer-motion"
import { Check, Zap, Crown, Sparkles, Infinity, Users, BarChart, Code, Headphones, Rocket } from "lucide-react"
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
      duration: 0.4,
    },
  },
}

const freeFeatures = [
  { icon: Check, text: "Up to 3 active tasks" },
  { icon: Check, text: "Basic task management" },
  { icon: Check, text: "5 categories" },
  { icon: Check, text: "Email notifications" },
  { icon: Check, text: "Mobile access" },
]

const premiumFeatures = [
  { icon: Infinity, text: "Unlimited tasks", highlight: true },
  { icon: Zap, text: "Advanced task management", highlight: true },
  { icon: Infinity, text: "Unlimited categories", highlight: true },
  { icon: Headphones, text: "Priority email support", highlight: false },
  { icon: Rocket, text: "Mobile access", highlight: false },
  { icon: BarChart, text: "Advanced analytics", highlight: true },
  { icon: Users, text: "Team collaboration", highlight: true },
  { icon: Code, text: "Custom workflows", highlight: false },
  { icon: Zap, text: "API access", highlight: true },
  { icon: Headphones, text: "Priority support", highlight: false },
]

export default function UpgradePage() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-6xl mx-auto"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 px-4 py-1.5 mb-4">
          <Zap className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Upgrade Your Experience</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock powerful features and take your productivity to the next level.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Free Plan */}
        <motion.div variants={itemVariants}>
          <Card className="relative h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2">
                  <Zap className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </div>
                Free Plan
              </CardTitle>
              <CardDescription className="text-base">
                Perfect for getting started
              </CardDescription>
              <div className="mt-6">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {freeFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    <feature.icon className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm">{feature.text}</span>
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
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 px-4 py-1.5">
                <Crown className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            <CardHeader className="pb-4 pt-8">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                Premium Plan
              </CardTitle>
              <CardDescription className="text-base">
                Unlock full potential with advanced features
              </CardDescription>
              <div className="mt-6">
                <span className="text-5xl font-bold">$12</span>
                <span className="text-muted-foreground ml-2">/month</span>
                <div className="text-sm text-emerald-600 mt-1">Save 20% with annual billing</div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="grid grid-cols-1 gap-3">
                {premiumFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    <div className={`rounded-full p-0.5 ${feature.highlight ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-slate-200 dark:bg-slate-700"}`}>
                      <feature.icon className={`h-4 w-4 ${feature.highlight ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <span className={`text-sm ${feature.highlight ? "font-medium" : "text-muted-foreground"}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2">
                  <Sparkles className="h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Features Comparison */}
      <motion.div variants={itemVariants} className="pt-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">Everything you need to succeed</h2>
          <p className="text-muted-foreground mt-1">Plus many more features to boost your productivity</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-md text-center p-6">
            <div className="rounded-full bg-indigo-100 dark:bg-indigo-950 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Infinity className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold">Unlimited Everything</h3>
            <p className="text-sm text-muted-foreground mt-1">No limits on tasks, projects, or categories</p>
          </Card>
          <Card className="border-0 shadow-md text-center p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-950 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold">Advanced Analytics</h3>
            <p className="text-sm text-muted-foreground mt-1">Deep insights into your productivity</p>
          </Card>
          <Card className="border-0 shadow-md text-center p-6">
            <div className="rounded-full bg-emerald-100 dark:bg-emerald-950 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold">Team Collaboration</h3>
            <p className="text-sm text-muted-foreground mt-1">Work together seamlessly with your team</p>
          </Card>
          <Card className="border-0 shadow-md text-center p-6">
            <div className="rounded-full bg-amber-100 dark:bg-amber-950 p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <Headphones className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold">Priority Support</h3>
            <p className="text-sm text-muted-foreground mt-1">Get help when you need it, fast</p>
          </Card>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div variants={itemVariants} className="pt-8 border-t">
        <h2 className="text-2xl font-semibold text-center mb-6">Frequently Asked Questions</h2>
        <div className="grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your premium subscription at any time. Your access will continue until the end of your billing period.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 14-day free trial for new premium users. No credit card required to start.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Can I switch plans later?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely! You can upgrade or downgrade your plan at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  )
}