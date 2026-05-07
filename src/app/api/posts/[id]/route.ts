import { prisma } from "@/lib/prisma";
import { auth } from "../../../../../auth";
import { NextRequest, NextResponse } from "next/server";

// Allowed fields for update (prevent mass assignment attacks)
const ALLOWED_UPDATE_FIELDS = ['title', 'description', 'category', 'status', 'dueDate', 'isCompleted'];

// Helper to validate and transform update data
function prepareUpdateData(data: any) {
  const updateData: any = {};
  
  for (const field of ALLOWED_UPDATE_FIELDS) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }
  
  // Sync isCompleted with status
  if (updateData.status) {
    updateData.isCompleted = updateData.status === "completed";
  }
  
  // Convert dueDate string to Date object
  if (updateData.dueDate && typeof updateData.dueDate === 'string') {
    updateData.dueDate = new Date(updateData.dueDate);
  }
  
  return updateData;
}

// GET - Get a specific task by ID
export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: taskId } = await params;
    
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
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: taskId } = await params;
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
    
    // Validate no invalid fields
    const invalidFields = Object.keys(rawUpdateData).filter(
      key => !ALLOWED_UPDATE_FIELDS.includes(key)
    );
    
    if (invalidFields.length > 0) {
      return NextResponse.json(
        { error: `Invalid fields: ${invalidFields.join(', ')}` },
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
    
    // Prepare and validate update data
    const updateData = prepareUpdateData(rawUpdateData);
    
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
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id: taskId } = await params;
    
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