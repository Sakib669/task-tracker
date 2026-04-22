import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";

// POST - Create a new task
export const POST = async (req: NextRequest) => {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }
    
    // 2. Parse request body
    const { title, description, category, dueDate, status } = await req.json();
    
    // 3. Validate required fields
    if (!title || title.trim() === "") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    
    // 4. Create task with userId from session (NOT from client)
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || null,
        category: category || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || "pending",
        isCompleted: status === "completed",
        userId: session.user.id, // 👈 Critical: Use session user ID
      },
    });
    
    return NextResponse.json(
      { success: true, data: task },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// GET - Get all tasks for the logged-in user
export const GET = async () => {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }
    
    // 2. Fetch ONLY current user's tasks
    const tasks = await prisma.task.findMany({
      where: { 
        userId: session.user.id  // 👈 Critical: Filter by user
      },
      orderBy: {
        createdAt: 'desc'  // Optional: Show newest first
      }
    });
    
    return NextResponse.json(
      { success: true, data: tasks, count: tasks.length },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};