
import { enqueueAIGeneration } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { goal } = await req.json();
  if (!goal || goal.length < 10) {
    return NextResponse.json(
      { error: "Goal must be at least 10 characters" },
      { status: 400 },
    );
  }

  try {
    const jobId = await enqueueAIGeneration(goal, session.user.id);
    return NextResponse.json({ jobId, status: "queued" });
  } catch (error) {
    console.error("Failed to enqueue AI job:", error);
    return NextResponse.json(
      { error: "Failed to schedule AI generation" },
      { status: 500 },
    );
  }
}
