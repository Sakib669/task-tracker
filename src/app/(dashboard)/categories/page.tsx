"use client"

import { motion } from "framer-motion"
import { Tag, Trash2, Edit, Plus, TrendingUp, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { categories, tasks } from "@/lib/mock-data"

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

export default function CategoriesPage() {
  const getCategoryStats = (category: string) => {
    const categoryTasks = tasks.filter((t) => t.category === category)
    const completed = categoryTasks.filter((t) => t.status === "completed").length
    return {
      total: categoryTasks.length,
      completed,
      pending: categoryTasks.length - completed,
      completionRate: categoryTasks.length > 0 ? Math.round((completed / categoryTasks.length) * 100) : 0,
    }
  }

  const categoryColors = [
    "from-indigo-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-amber-500 to-yellow-600",
    "from-violet-500 to-fuchsia-600",
  ]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-7"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize your tasks by categories for better management.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const stats = getCategoryStats(category)
          const gradient = categoryColors[index % categoryColors.length]
          
          return (
            <motion.div key={category} variants={itemVariants}>
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${gradient}`} />
                <CardHeader className="pb-3 pt-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className={`rounded-lg bg-gradient-to-br ${gradient} p-2`}>
                        <Tag className="h-4 w-4 text-white" />
                      </div>
                      {category}
                    </CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats Row */}
                  <div className="flex items-center justify-around py-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.total}</div>
                      <div className="text-xs text-muted-foreground">Total Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">{stats.completed}</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold">{stats.completionRate}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex gap-3 pt-2">
                    <div className="flex-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      <span>{stats.completionRate}% done</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{stats.completed} finished</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{stats.pending} remaining</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}