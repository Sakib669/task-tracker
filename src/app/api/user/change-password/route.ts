import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const body = await req.json()
        const { currentPassword, newPassword } = body

        if(!currentPassword || !newPassword) {
            return NextResponse.json({error: "Current password and new password are required"}, {status: 400})
        }

        if(newPassword.length < 8) {
            return NextResponse.json({error: "New password must be at least 8 characters"}, {status: 400})
        }

        // Here you would typically verify the current password and update it to the new password in your database
        const user = await prisma.user.findUnique({ where: { id: session.user.id } })
        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404})
        }
        //  comparing current password with the one in the database (you should hash the password in a real application)
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
        if (!isCurrentPasswordValid) {
            return NextResponse.json({error: "Current password is incorrect"}, {status: 400})
        }

        // Update the user's password in the database
        const hashedNewPassword = await bcrypt.hash(newPassword, 10)
        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedNewPassword }
        })


        return NextResponse.json({ message: "Password updated successfully", success: true }, {status: 200})
    } catch (error) {
        
    }
}