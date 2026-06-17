import { z } from "zod";

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters long"),
  newPassword: z.string().min(8, "New password must be at least 8 characters long"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(255).optional(),
  email: z.string().email("Invalid email address").optional(),
});
