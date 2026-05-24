import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = loginSchema.extend({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(40, "Username must be 40 characters or less."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const applicationSchema = z.object({
  name: z
    .string()
    .min(1, "Application name is required.")
    .regex(/^\S+$/, "Application name cannot contain spaces."),
});
