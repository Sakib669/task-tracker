"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

interface TaskChartProps {
  tasks: Array<{
    id: string;
    status: string;
    category: string | null;
    createdAt: string;
    isCompleted: boolean;
  }>;
}

export function TaskChart({ tasks }: TaskChartProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isCompleted).length;
  const pendingTasks = tasks.filter(
    (t) => !t.isCompleted && t.status !== "in-progress",
  ).length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;

  // Status Distribution Data
  const statusData = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [completedTasks, inProgressTasks, pendingTasks],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)", // Emerald
          "rgba(245, 158, 11, 0.8)", // Amber
          "rgba(100, 116, 139, 0.8)", // Slate
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(100, 116, 139, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  // Category Distribution
  const categories = [
    "Design",
    "Development",
    "Marketing",
    "Sales",
    "Support",
    "Management",
  ];
  const categoryData = {
    labels: categories,
    datasets: [
      {
        label: "Tasks per Category",
        data: categories.map(
          (cat) => tasks.filter((t) => t.category === cat).length,
        ),
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)", // Indigo
          "rgba(139, 92, 246, 0.8)", // Purple
          "rgba(236, 72, 153, 0.8)", // Pink
          "rgba(34, 197, 94, 0.8)", // Green
          "rgba(251, 146, 60, 0.8)", // Orange
          "rgba(6, 182, 212, 0.8)", // Cyan
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(251, 146, 60, 1)",
          "rgba(6, 182, 212, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Status Doughnut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              {totalTasks > 0 ? (
                <Doughnut data={statusData} options={chartOptions} />
              ) : (
                <p className="text-muted-foreground text-center">
                  No tasks yet. Create your first task!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Tasks by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {totalTasks > 0 ? (
                <Bar data={categoryData} options={barOptions} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No data to display</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
