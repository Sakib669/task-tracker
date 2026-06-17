import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { updateProfileSchema } from "@/lib/validations/user";
import { logger } from "@/lib/logger";

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validation.error.formErrors.fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email } = validation.data;
    const updateData: { name?: string; email?: string } = {};
    if (name !== undefined) updateData.name = name.trim();
    if (email !== undefined) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    logger.info(`Profile updated for user ${session.user.id}`);

    return NextResponse.json({
      message: "Profile updated successfully",
      success: true,
    });
  } catch (error) {
    logger.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
