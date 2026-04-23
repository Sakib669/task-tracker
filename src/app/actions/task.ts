"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";

// Create Task Action
export async function createNewTask(data: any) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const { title, description, category, dueDate, status } = data;

  if (!title) throw new Error("Title is required");

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description,
      category,
      dueDate: dueDate ? new Date(dueDate) : null,
      status: status || "pending",
      isCompleted: status === "completed",
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");

  return { success: true, task };
}