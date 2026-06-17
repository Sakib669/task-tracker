import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";
import { NextRequest, NextResponse } from "next/server";
import { updatePostSchema } from "@/lib/validations/post";

// GET - Get a specific task by ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id: taskId } = params;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: session.user.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "Task not found or you don't have access" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: task },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// PATCH - Update a specific task
export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id: taskId } = params;
    const rawUpdateData = await req.json();

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Validate request body with Zod
    const validation = updatePostSchema.safeParse(rawUpdateData);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validation.error.formErrors.fieldErrors },
        { status: 400 }
      );
    }

    const updateData = validation.data;

    // Convert dueDate string to Date object if present
    if (updateData.dueDate && typeof updateData.dueDate === 'string') {
      (updateData as any).dueDate = new Date(updateData.dueDate);
    } else if (updateData.dueDate === null) {
      (updateData as any).dueDate = null;
    }

    // Verify task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: session.user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    console.log(`Task ${taskId} updated by user ${session.user.id}`);

    return NextResponse.json(
      { success: true, data: updatedTask },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// DELETE - Delete a specific task
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id: taskId } = params;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: session.user.id,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    console.log(`Task ${taskId} deleted by user ${session.user.id}`);

    return NextResponse.json(
      { success: true, message: "Task deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};