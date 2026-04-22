import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";
import { NextRequest, NextResponse } from "next/server";

// GET - Get a specific task by ID
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: taskId } = await params;
    
    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }
    
    // Validate task ID
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }
    
    // Fetch the specific task and verify ownership
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: session.user.id, // Ensure task belongs to user
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
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: taskId } = await params;
    const updatedTaskData = await req.json();
    
    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }
    
    // Validate task ID
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
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
    
    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updatedTaskData,
    });
    
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
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: taskId } = await params;
    
    // Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }
    
    // Validate task ID
    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
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
        { error: "Task not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }
    
    // Delete the task
    const deletedTask = await prisma.task.delete({
      where: { id: taskId },
    });
    
    return NextResponse.json(
      { success: true, message: "Task deleted successfully", data: deletedTask },
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