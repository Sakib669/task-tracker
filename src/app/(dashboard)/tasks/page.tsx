"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Search, Filter, ChevronDown, Grid, List } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { tasks, categories, Task } from "@/lib/mock-data"
import { AddTaskModal } from "@/components/forms/AddTaskModal"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}

function getStatusBadgeVariant(status: Task["status"]) {
  switch (status) {
    case "completed":
      return "success"
    case "in-progress":
      return "warning"
    case "pending":
      return "secondary"
    default:
      return "outline"
  }
}

function getStatusLabel(status: Task["status"]) {
  switch (status) {
    case "completed":
      return "Completed"
    case "in-progress":
      return "In Progress"
    case "pending":
      return "Pending"
    default:
      return status
  }
}

export default function TasksPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [visibleTasks, setVisibleTasks] = useState(8)

  const filteredTasks = tasks.filter((task) => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (statusFilter !== "all" && task.status !== statusFilter) {
      return false
    }
    if (categoryFilter !== "all" && task.category !== categoryFilter) {
      return false
    }
    return true
  })

  const displayedTasks = filteredTasks.slice(0, visibleTasks)

  const handleLoadMore = () => {
    setVisibleTasks((prev) => prev + 8)
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track all your tasks in one place.
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <AddTaskModal onClose={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-l-none border-l"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <motion.div variants={itemVariants} className="text-sm text-muted-foreground">
        Showing {displayedTasks.length} of {filteredTasks.length} tasks
      </motion.div>

      {/* Tasks List/Grid */}
      {viewMode === "list" ? (
        <motion.div variants={itemVariants} className="space-y-3">
          <AnimatePresence>
            {displayedTasks.map((task) => (
              <motion.div
                key={task.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ x: 4 }}
                className="group"
              >
                <Card className="transition-all hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Checkbox
                      checked={task.status === "completed"}
                      className="shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-medium truncate ${
                            task.status === "completed"
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        <Badge variant={getStatusBadgeVariant(task.status)} className="shrink-0">
                          {getStatusLabel(task.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {task.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {task.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground shrink-0 hidden sm:block">
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence>
            {displayedTasks.map((task) => (
              <motion.div
                key={task.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="h-full">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`font-medium line-clamp-2 ${
                          task.status === "completed"
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <Badge
                        variant={getStatusBadgeVariant(task.status)}
                        className="shrink-0"
                      >
                        {getStatusLabel(task.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{task.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Load More Button */}
      {displayedTasks.length < filteredTasks.length && (
        <motion.div variants={itemVariants} className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="gap-2"
          >
            Load More
            <ChevronDown className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <div className="rounded-full bg-muted p-6 mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No tasks found</h3>
          <p className="text-muted-foreground max-w-sm">
            Try adjusting your filters or search terms to find what you're looking
            for.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}