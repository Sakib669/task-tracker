"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, CheckCircle2, AlertCircle, Tag, GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// ---------- Types ----------
interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  dueDate: string | null;
}

interface Column {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

// ---------- Constants ----------
const columns: Column[] = [
  {
    id: "pending",
    title: "Pending",
    icon: AlertCircle,
    color: "from-slate-500 to-slate-600",
    bgColor: "bg-slate-50 dark:bg-slate-900/50",
  },
  {
    id: "in-progress",
    title: "In Progress",
    icon: Clock,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
  {
    id: "completed",
    title: "Completed",
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
];

// ---------- Sortable Task Card ----------
function SortableTaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className="border-0 shadow-md hover:shadow-lg transition-all group">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
            >
              <GripVertical className="h-4 w-4" />
            </button>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {task.category && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <Tag className="h-3 w-3" />
                    {task.category}
                  </Badge>
                )}
                {task.dueDate && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Column Component ----------
function KanbanColumn({
  column,
  tasks,
}: {
  column: Column;
  tasks: Task[];
}) {
  const Icon = column.icon;

  return (
    <div className="flex flex-col">
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`rounded-lg bg-gradient-to-br ${column.color} p-2`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h3 className="font-semibold text-lg">{column.title}</h3>
        <Badge variant="secondary" className="ml-auto">
          {tasks.length}
        </Badge>
      </div>

      {/* Tasks List */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={`flex-1 rounded-xl p-3 min-h-[400px] ${column.bgColor}`}
        >
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Drop tasks here
            </div>
          ) : (
            tasks.map((task) => <SortableTaskCard key={task.id} task={task} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// ---------- Main Page ----------
export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Configure sensor for better drag behavior
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    })
  );

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/posts");
      const data = await response.json();
      if (data.success) {
        setTasks(data.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Find which column the task was dropped on
    let newStatus = "";

    // Check if dropped on a column directly
    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn) {
      newStatus = targetColumn.id;
    } else {
      // Dropped on another task - find what column that task is in
      const targetTask = tasks.find((t) => t.id === overId);
      if (targetTask) {
        newStatus = targetTask.status;
      }
    }

    if (!newStatus) return;

    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask || currentTask.status === newStatus) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              isCompleted: newStatus === "completed",
            }
          : task
      )
    );

    try {
      await fetch(`/api/posts/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          isCompleted: newStatus === "completed",
        }),
      });
    } catch (error) {
      // Revert on error
      fetchTasks();
      console.error("Error updating task:", error);
    }
  };

  // Find which droppable a task belongs to
  const findColumnOfTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    return task?.status || "pending";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Kanban Board
        </h1>
        <p className="text-muted-foreground mt-1">
          Drag and drop tasks to update their status.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
            />
          ))}
        </div>

        {/* Drag Overlay - shows the task being dragged */}
        <DragOverlay>
          {activeTask ? (
            <Card className="border-0 shadow-xl rotate-2 scale-105 w-72">
              <CardContent className="p-4">
                <h4 className="font-semibold text-sm">{activeTask.title}</h4>
                {activeTask.category && (
                  <Badge variant="outline" className="text-xs gap-1 mt-2">
                    <Tag className="h-3 w-3" />
                    {activeTask.category}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </motion.div>
  );
}