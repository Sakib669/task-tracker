"use server"; // এটিই মূল জাদু!

import { createNewUser } from "@/modules/user/user.service";

export async function handleSignUp({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const user = await createNewUser({
      name,
      email,
      password,
    });
    return { success: true, user };
  } catch (error: any) {
    return { error: error.message };
  }
}
