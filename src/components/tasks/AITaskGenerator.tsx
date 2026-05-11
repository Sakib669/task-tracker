"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Plus, Check, Target, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { generateTasks } from "@/app/actions/ait";

interface AITask {
  title: string;
  description: string;
  category: string;
  dueDate: string | null;
}

interface AITaskGeneratorProps {
  onClose: () => void;
  onTasksCreated: () => void;
}

export function AITaskGenerator({ onClose, onTasksCreated }: AITaskGeneratorProps) {
  const [goal, setGoal] = useState("");
  const [generatedTasks, setGeneratedTasks] = useState<AITask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setIsGenerating(true);
    setGeneratedTasks([]);
    setSelectedTasks([]);

    try {
      const result = await generateTasks(goal);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result.tasks) {
        setGeneratedTasks(result.tasks);
        // Auto-select all generated tasks
        setSelectedTasks(result.tasks.map((_, i) => i));
        toast.success(`${result.tasks.length} tasks generated!`);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      toast.error("Failed to generate tasks");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = (index: number) => {
    setSelectedTasks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAddTasks = async () => {
    if (selectedTasks.length === 0) {
      toast.error("Select at least one task to add");
      return;
    }

    setIsAdding(true);

    try {
      const tasksToAdd = selectedTasks.map((index) => generatedTasks[index]);

      // Create all selected tasks
      const promises = tasksToAdd.map((task) =>
        fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            category: task.category,
            dueDate: task.dueDate,
            status: "pending",
          }),
        })
      );

      await Promise.all(promises);
      toast.success(`${tasksToAdd.length} tasks added successfully!`);
      onTasksCreated();
      onClose();
    } catch (err) {
      toast.error("Failed to add some tasks");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Goal Input */}
      <div className="space-y-2">
        <Label htmlFor="goal" className="text-sm font-semibold flex items-center gap-2">
          <Target className="h-4 w-4" />
          What do you want to accomplish?
        </Label>
        <Textarea
          id="goal"
          placeholder="E.g., Plan a team retreat for 15 people with a budget of $5000, or Launch a new mobile app in 3 months..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="min-h-[100px]"
          disabled={isGenerating}
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || goal.trim().length < 10}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 gap-2"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Tasks with AI
          </>
        )}
      </Button>

      {/* Generated Tasks */}
      {generatedTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">
              Generated Tasks ({generatedTasks.length})
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setSelectedTasks(
                  selectedTasks.length === generatedTasks.length
                    ? []
                    : generatedTasks.map((_, i) => i)
                )
              }
              className="text-xs"
            >
              {selectedTasks.length === generatedTasks.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          {generatedTasks.map((task, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`border-0 shadow-sm cursor-pointer transition-all hover:shadow-md ${
                  selectedTasks.includes(index) ? "ring-2 ring-indigo-500" : ""
                }`}
                onClick={() => toggleTask(index)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedTasks.includes(index)}
                      onCheckedChange={() => toggleTask(index)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs gap-1">
                          <Tag className="h-3 w-3" />
                          {task.category}
                        </Badge>
                        {task.dueDate && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Add Tasks Button */}
          <Button
            onClick={handleAddTasks}
            disabled={isAdding || selectedTasks.length === 0}
            className="w-full gap-2"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding Tasks...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add {selectedTasks.length} Selected Task{selectedTasks.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}