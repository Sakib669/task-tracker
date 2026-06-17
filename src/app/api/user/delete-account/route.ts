import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { logger } from "@/lib/logger";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all tasks first (cascade handled by Prisma, but explicit for safety)
    await prisma.task.deleteMany({
      where: { userId: session.user.id },
    });

    await prisma.user.delete({
      where: { id: session.user.id },
    });

    logger.info(`Account deleted for user ${session.user.id}`);

    return NextResponse.json({ success: true, message: "Account deleted" });
  } catch (error) {
    logger.error("Account deletion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
