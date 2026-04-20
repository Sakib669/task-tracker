export interface Task {
  id: string
  title: string
  description: string
  category: string
  status: "pending" | "in-progress" | "completed"
  dueDate: string
  assignee?: string
}

export const categories = [
  "Design",
  "Development",
  "Marketing",
  "Sales",
  "Support",
  "Management",
]

export const tasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description: "Create a modern and responsive landing page design for the new product launch.",
    category: "Design",
    status: "completed",
    dueDate: "2024-01-15",
    assignee: "Sarah Johnson",
  },
  {
    id: "2",
    title: "Implement user authentication",
    description: "Set up JWT-based authentication system with refresh tokens.",
    category: "Development",
    status: "in-progress",
    dueDate: "2024-01-20",
    assignee: "John Doe",
  },
  {
    id: "3",
    title: "Create social media content",
    description: "Develop engaging content for Q1 social media campaign.",
    category: "Marketing",
    status: "pending",
    dueDate: "2024-01-25",
    assignee: "Emily Chen",
  },
  {
    id: "4",
    title: "Review quarterly reports",
    description: "Analyze Q4 performance metrics and prepare summary.",
    category: "Management",
    status: "pending",
    dueDate: "2024-01-22",
    assignee: "Michael Brown",
  },
  {
    id: "5",
    title: "Fix checkout bug",
    description: "Resolve payment processing issue on checkout page.",
    category: "Development",
    status: "in-progress",
    dueDate: "2024-01-18",
    assignee: "Alex Kim",
  },
  {
    id: "6",
    title: "Customer feedback analysis",
    description: "Review and categorize customer feedback from support tickets.",
    category: "Support",
    status: "pending",
    dueDate: "2024-01-28",
    assignee: "Lisa Wong",
  },
  {
    id: "7",
    title: "Update brand guidelines",
    description: "Refresh brand guidelines document with new color palette.",
    category: "Design",
    status: "completed",
    dueDate: "2024-01-10",
    assignee: "Sarah Johnson",
  },
  {
    id: "8",
    title: "Set up analytics dashboard",
    description: "Configure Google Analytics 4 and create custom dashboards.",
    category: "Marketing",
    status: "completed",
    dueDate: "2024-01-12",
    assignee: "Emily Chen",
  },
  {
    id: "9",
    title: "API documentation",
    description: "Write comprehensive API documentation for developers.",
    category: "Development",
    status: "pending",
    dueDate: "2024-02-01",
    assignee: "John Doe",
  },
  {
    id: "10",
    title: "Sales pipeline review",
    description: "Review and optimize sales pipeline stages.",
    category: "Sales",
    status: "pending",
    dueDate: "2024-01-30",
    assignee: "David Miller",
  },
  {
    id: "11",
    title: "Mobile app wireframes",
    description: "Create wireframes for the new mobile application.",
    category: "Design",
    status: "in-progress",
    dueDate: "2024-01-24",
    assignee: "Sarah Johnson",
  },
  {
    id: "12",
    title: "Email campaign setup",
    description: "Configure automated email sequences for new users.",
    category: "Marketing",
    status: "pending",
    dueDate: "2024-02-05",
    assignee: "Emily Chen",
  },
]

export function getStats() {
  const total = tasks.length
  const completed = tasks.filter((t) => t.status === "completed").length
  const inProgress = tasks.filter((t) => t.status === "in-progress").length
  const pending = tasks.filter((t) => t.status === "pending").length
  const remaining = total - completed

  return {
    total,
    completed,
    inProgress,
    pending,
    remaining,
  }
}

export function getRecentTasks(count = 5) {
  return tasks.slice(0, count)
}

export function getFilteredTasks({
  search,
  status,
  category,
}: {
  search?: string
  status?: string
  category?: string
}) {
  return tasks.filter((task) => {
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    if (status && task.status !== status) {
      return false
    }
    if (category && task.category !== category) {
      return false
    }
    return true
  })
}