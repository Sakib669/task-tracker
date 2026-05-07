"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  Grid,
  List,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  MoreHorizontal,
  Edit,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { categories, Task } from "@/lib/mock-data";
import { AddTaskModal } from "@/components/forms/AddTaskModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

function getStatusBadgeVariant(status: Task["status"]) {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 cursor-pointer hover:bg-emerald-200";
    case "in-progress":
      return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 cursor-pointer hover:bg-amber-200";
    case "pending":
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 cursor-pointer hover:bg-slate-200";
    default:
      return "";
  }
}

function getStatusLabel(status: Task["status"]) {
  switch (status) {
    case "completed":
      return "Completed";
    case "in-progress":
      return "In Progress";
    case "pending":
      return "Pending";
    default:
      return status;
  }
}

function getStatusIcon(status: Task["status"]) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-3 w-3 mr-1" />;
    case "in-progress":
      return <Clock className="h-3 w-3 mr-1" />;
    case "pending":
      return <AlertCircle className="h-3 w-3 mr-1" />;
    default:
      return null;
  }
}

// Function to get next status for cycling
function getNextStatus(currentStatus: Task["status"]): Task["status"] {
  switch (currentStatus) {
    case "pending":
      return "in-progress";
    case "in-progress":
      return "completed";
    case "completed":
      return "pending";
    default:
      return "pending";
  }
}

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [visibleTasks, setVisibleTasks] = useState(8);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Delete confirmation state
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts");
      const data = await response.json();
      setTasks(data?.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isAddModalOpen]);

  // Delete task
  const handleDeleteTask = async () => {
    if (!deleteTaskId) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${deleteTaskId}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== deleteTaskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTaskId(null);
    }
  };

  // Update task status using checkbox (complete/incomplete)
  const handleToggleComplete = async (taskId: string, currentStatus: Task["status"]) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    
    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    
    try {
      await fetch(`/api/posts/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      // Revert on error
      fetchTasks();
      console.error("Error updating task:", error);
    }
  };

  // Update task status via badge click (cycle through statuses)
  const handleStatusCycle = async (taskId: string, currentStatus: Task["status"]) => {
    const newStatus = getNextStatus(currentStatus);
    
    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    
    try {
      await fetch(`/api/posts/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (error) {
      // Revert on error
      fetchTasks();
      console.error("Error updating task status:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "all" && task.status !== statusFilter) {
      return false;
    }
    if (categoryFilter !== "all" && task.category !== categoryFilter) {
      return false;
    }
    return true;
  });

  const displayedTasks = filteredTasks.slice(0, visibleTasks);

  const handleLoadMore = () => {
    setVisibleTasks((prev) => prev + 8);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-7"
      >
        {/* Page Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              My Tasks
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your tasks in one place.
            </p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  Create New Task
                </DialogTitle>
              </DialogHeader>
              <AddTaskModal onClose={() => setIsAddModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 bg-white/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-11">
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
              <SelectTrigger className="w-[160px] h-11">
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
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="rounded-none h-11 w-11"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="rounded-none h-11 w-11 border-l"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <motion.div
          variants={itemVariants}
          className="text-sm text-muted-foreground"
        >
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
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                    <CardContent className="flex items-center gap-4 p-5">
                      {/* Checkbox for complete/incomplete */}
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={() => handleToggleComplete(task.id, task.status)}
                        className="h-5 w-5 border-2 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`font-semibold truncate ${
                              task.status === "completed"
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {task.title}
                          </p>
                          {/* Clickable status badge - cycles through statuses */}
                          <Badge
                            className={`text-xs ${getStatusBadgeVariant(task.status)}`}
                            onClick={() => handleStatusCycle(task.id, task.status)}
                          >
                            {getStatusIcon(task.status)}
                            {getStatusLabel(task.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {task.description}
                        </p>
                      </div>
                      
                      <Badge variant="outline" className="shrink-0 gap-1">
                        <Tag className="h-3 w-3" />
                        {task.category}
                      </Badge>
                      
                      <span className="text-sm text-muted-foreground shrink-0 hidden sm:flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      
                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteTaskId(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence>
              {displayedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1">
                          <Checkbox
                            checked={task.status === "completed"}
                            onCheckedChange={() => handleToggleComplete(task.id, task.status)}
                            className="mt-0.5 h-4 w-4 border-2 data-[state=checked]:bg-emerald-600"
                          />
                          <p
                            className={`font-semibold line-clamp-2 flex-1 ${
                              task.status === "completed"
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {task.title}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 text-red-500 hover:text-red-600"
                          onClick={() => setDeleteTaskId(task.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {task.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <Badge variant="outline" className="gap-1">
                          <Tag className="h-3 w-3" />
                          {task.category}
                        </Badge>
                        <Badge
                          className={`text-xs ${getStatusBadgeVariant(task.status)}`}
                          onClick={() => handleStatusCycle(task.id, task.status)}
                        >
                          {getStatusLabel(task.status)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
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
          <motion.div
            variants={itemVariants}
            className="flex justify-center pt-4"
          >
            <Button
              variant="outline"
              onClick={handleLoadMore}
              className="gap-2 h-11 px-6"
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
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 p-6 mb-4">
              <Search className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mt-2">No tasks found</h3>
            <p className="text-muted-foreground max-w-sm mt-2">
              Try adjusting your filters or search terms to find what you're
              looking for.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This task will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}