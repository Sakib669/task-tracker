import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const getUserFromDb = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      console.log(`Auth attempt failed: User ${email} not found`);
      return null;
    }
    return user;
  } catch (error) {
    console.error("Database error in getUserFromDb:", error);
    return null;
  }
};

export const createNewUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    if (!name || !email || !password) {
      console.log("Please input proper credentials");
      return null;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return newUser;
  } catch (error) {
    console.error("Error occured creating new user", error);
    return null;
  }
};
