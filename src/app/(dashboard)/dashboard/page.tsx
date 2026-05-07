"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Tag,
  FileText,
  Inbox,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TaskActions } from "@/components/tasks/TaskActions";
import { EditTaskDialog } from "@/components/tasks/EditTaskDialog";

interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  isCompleted: boolean;
  status: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  "Design",
  "Development",
  "Marketing",
  "Sales",
  "Support",
  "Management",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
      ease: "easeOut",
    },
  },
};

function StatCard({
  title,
  value,
  icon: Icon,
  gradient,
  trend,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  trend?: { value: number; label: string };
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
              {trend && (
                <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                  ↑ {trend.value}% {trend.label}
                </p>
              )}
            </div>
            <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-3 shadow-lg`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isCompleted;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Checkbox
              checked={task.isCompleted}
              onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
              className="mt-1 h-5 w-5 border-2 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3
                  className={`font-semibold ${task.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}
                >
                  {task.title}
                </h3>
                <TaskActions
                  taskId={task.id}
                  onEdit={() => onEdit(task)}
                  onDelete={onDelete}
                />
              </div>
              {task.description && (
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {task.category && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {task.category}
                  </Badge>
                )}
                {task.dueDate && (
                  <Badge
                    variant={isOverdue ? "destructive" : "outline"}
                    className="text-xs"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(task.dueDate)}
                  </Badge>
                )}
                <Badge
                  className={`text-xs ${
                    task.isCompleted
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                      : task.status === "in-progress"
                      ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {task.isCompleted ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </>
                  ) : task.status === "in-progress" ? (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Pending
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TaskCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Skeleton className="h-5 w-5 mt-1 rounded" />
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onCreateTask }: { onCreateTask: () => void }) {
  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-16">
      <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 p-6 mb-4">
        <Inbox className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Create your first task to get started and organize your work efficiently.
      </p>
      <Button
        onClick={onCreateTask}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create your first task
      </Button>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts");
      const data = await response.json();

      if (data.success) {
        const mappedTasks = data.data.map((task: any) => ({
          ...task,
          status: task.isCompleted ? "completed" : task.status || "pending",
        }));
        setTasks(mappedTasks);
      } else {
        setError(data.error || "Failed to fetch tasks");
      }
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleTask = async (id: string, completed: boolean) => {
    // Optimistic update
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            isCompleted: completed,
            status: completed ? "completed" : "pending",
          }
        : task
    );
    setTasks(updatedTasks);

    try {
      await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isCompleted: completed,
          status: completed ? "completed" : "pending",
        }),
      });
    } catch (error) {
      // Revert on error
      fetchTasks();
      console.error("Error toggling task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          category: category || null,
          dueDate: dueDate || null,
          status: "pending",
        }),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setCategory("");
        setDueDate("");
        setDialogOpen(false);
        fetchTasks();
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.isCompleted).length,
    pending: tasks.filter((t) => !t.isCompleted).length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
        {/* Welcome Section */}
        <motion.div variants={itemVariants} className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your productivity overview.</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            title="Total Tasks"
            value={stats.total}
            icon={TrendingUp}
            gradient="from-blue-500 to-cyan-500"
            trend={{ value: 12, label: "vs last week" }}
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CheckCircle2}
            gradient="from-emerald-500 to-teal-500"
            trend={{ value: completionRate, label: "completion rate" }}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={AlertCircle}
            gradient="from-amber-500 to-orange-500"
          />
        </div>

        {/* Tasks Section */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Your Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {loading ? (
                  <div className="space-y-4">
                    <TaskCardSkeleton />
                    <TaskCardSkeleton />
                    <TaskCardSkeleton />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-red-100 dark:bg-red-950 p-4 mb-4">
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-red-600 mb-4 text-center">{error}</p>
                    <Button onClick={fetchTasks} variant="outline">
                      Retry
                    </Button>
                  </div>
                ) : tasks.length === 0 ? (
                  <EmptyState onCreateTask={() => setDialogOpen(true)} />
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onToggle={handleToggleTask}
                        onEdit={setEditingTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Create Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Task</DialogTitle>
            <DialogDescription>Fill in the details below to add a new task to your workspace.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTask} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Task Title
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pl-9 h-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description (Optional)
              </Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">
                  Category
                </Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="pl-9 h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-semibold">
                  Due Date (Optional)
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="pl-9 h-11"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <EditTaskDialog
        task={editingTask}
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onTaskUpdated={fetchTasks}
      />
    </>
  );
}