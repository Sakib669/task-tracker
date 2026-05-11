"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface AITask {
  title: string;
  description: string;
  category: string;
  dueDate: string | null;
}

const categories = ["Design", "Development", "Marketing", "Sales", "Support", "Management"];

export async function generateTasks(goal: string): Promise<{ tasks?: AITask[]; error?: string }> {
  try {
    if (!goal || goal.trim().length < 10) {
      return { error: "Please enter a more detailed goal (at least 10 characters)" };
    }

    // Calculate dates for the next 7-14 days
    const today = new Date();
    const daysFromNow = (days: number) => {
      const date = new Date(today);
      date.setDate(date.getDate() + days);
      return date.toISOString().split("T")[0]; // Returns yyyy-mm-dd
    };

    const prompt = `You are a task management assistant. Break down the following goal into 3-5 actionable tasks.

Goal: "${goal}"

Return ONLY a valid JSON array of tasks. Each task must have:
- title: A short, clear title (max 80 characters)
- description: A brief description explaining the task (max 150 characters)
- category: One of: ${categories.join(", ")}
- dueDate: A suggested due date in yyyy-mm-dd format, use dates between ${daysFromNow(3)} and ${daysFromNow(14)}

Example format:
[
  {
    "title": "Research venue options",
    "description": "Find and compare 5 potential venues for the team retreat within budget",
    "category": "Management",
    "dueDate": "${daysFromNow(7)}"
  }
]

Return ONLY the JSON array. No markdown formatting, no code blocks, no additional text. Just the raw JSON array.`;

    // Use Gemini 1.5 Flash - fast and free tier friendly
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    let content = response.text();

    if (!content) {
      return { error: "No response from AI. Please try again." };
    }

    // Clean the response - remove any markdown formatting
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse the JSON
    let tasks: AITask[];
    try {
      tasks = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      
      // Try to extract JSON from the text if it's wrapped in other text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          tasks = JSON.parse(jsonMatch[0]);
        } catch {
          return { error: "Failed to parse AI response. Please try again with a clearer goal." };
        }
      } else {
        return { error: "Failed to parse AI response. Please try again." };
      }
    }

    // Validate the tasks
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return { error: "No tasks generated. Please try with a different goal." };
    }

    // Clean and validate each task
    tasks = tasks.map((task, index) => ({
      title: task.title?.trim() || `Task ${index + 1}`,
      description: task.description?.trim() || "",
      category: categories.includes(task.category?.trim()) ? task.category.trim() : "Development",
      dueDate: task.dueDate || null,
    }));

    // Limit to 5 tasks max
    tasks = tasks.slice(0, 5);

    return { tasks };
  } catch (error: any) {
    console.error("AI generation error:", error);
    
    // Handle specific Gemini errors
    if (error?.message?.includes("API key")) {
      return { error: "Invalid API key. Please check your Gemini API key." };
    }
    if (error?.message?.includes("quota")) {
      return { error: "API quota exceeded. Please try again later." };
    }
    
    return { error: "Failed to generate tasks. Please try again." };
  }
}