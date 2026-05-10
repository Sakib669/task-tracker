import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";

export const PATCH = async (req: NextRequest) => {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;
    console.log("Received name:", name);

    if (!name || name.trim().length < 2) {
      return new NextResponse("Name must be at least 2 characters long", {
        status: 400,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    });


    if (!updatedUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
