import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  isCompleted: z.boolean().optional().default(false),
  category: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(), // ISO 8601 string for DateTime
  status: z.enum(["pending", "in-progress", "completed"]).optional().default("pending"),
});

export const updatePostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255).optional(),
  description: z.string().optional(),
  isCompleted: z.boolean().optional(),
  category: z.string().optional(),
  dueDate: z.string().datetime().optional().nullable(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
});
