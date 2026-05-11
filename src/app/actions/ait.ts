"use server";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

interface AITask {
  title: string;
  description: string;
  category: string;
  dueDate: string | null;
}

const categories = [
  "Design",
  "Development",
  "Marketing",
  "Sales",
  "Support",
  "Management",
];

export async function generateTasks(
  goal: string,
): Promise<{ tasks?: AITask[]; error?: string }> {
  try {
    if (!goal || goal.trim().length < 10) {
      return {
        error: "Please enter a more detailed goal (at least 10 characters)",
      };
    }

    const daysFromNow = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      return date.toISOString().split("T")[0];
    };

    const prompt = `You are a task management assistant. Break down the following goal into 3-5 actionable tasks.

Goal: "${goal}"

Return ONLY a valid JSON array of tasks. Each task must have:
- title: A short, clear title (max 80 characters)
- description: A brief description (max 150 characters)
- category: One of: ${categories.join(", ")}
- dueDate: yyyy-mm-dd format between ${daysFromNow(3)} and ${daysFromNow(14)}

Example: [{"title":"Research venues","description":"Find and compare 5 venues","category":"Management","dueDate":"${daysFromNow(7)}"}]

Return ONLY the JSON array. No markdown, no code blocks, no additional text. Just the raw JSON array.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful task management assistant that returns only valid JSON arrays.",
        },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
    });

    let content = completion.choices[0]?.message?.content;

    if (!content) {
      return { error: "No response from AI. Please try again." };
    }

    // Clean response
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let tasks: AITask[];
    try {
      tasks = JSON.parse(content);
    } catch {
      // Try to extract JSON if wrapped in text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          tasks = JSON.parse(jsonMatch[0]);
        } catch {
          return { error: "Failed to parse AI response. Please try again." };
        }
      } else {
        return { error: "Failed to parse AI response. Please try again." };
      }
    }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return { error: "No tasks generated. Please try with a different goal." };
    }

    tasks = tasks.slice(0, 5).map((task, index) => ({
      title: task.title?.trim() || `Task ${index + 1}`,
      description: task.description?.trim() || "",
      category: categories.includes(task.category?.trim())
        ? task.category.trim()
        : "Development",
      dueDate: task.dueDate || null,
    }));

    return { tasks };
  } catch (error: any) {
    console.error("AI generation error:", error);
    if (error?.message?.includes("API key")) {
      return { error: "Invalid API key. Please check your Groq API key." };
    }
    return { error: "Failed to generate tasks. Please try again." };
  }
}
