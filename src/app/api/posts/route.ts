import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { createPostSchema } from "@/lib/validations/post";
import { logger } from "@/lib/logger";

// POST - Create a new task
export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const validation = createPostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validation.error.formErrors.fieldErrors,
        },
        { status: 400 },
      );
    }

    const { title, description, category, dueDate, status, isCompleted } =
      validation.data;

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || null,
        category: category || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || "pending",
        isCompleted: isCompleted ?? status === "completed",
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    logger.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};

// GET - Get all tasks for the logged-in user
export const GET = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 },
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, data: tasks, count: tasks.length },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
