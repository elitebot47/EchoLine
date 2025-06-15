import { z } from "zod";

export const UserCreateSchema = z.object({
  name: z.string().min(3, "Name must be at least 2 characters"),
  email: z.string().min(6, "Invalid email!"),
  password: z.string().min(6, "Password must be at least 8 characters"),
});
export const UserSigninSchema = z.object({
  email: z.string().min(6, "Invalid email! must be atleast 6 letter long"),
  password: z.string().min(6, "Password must be at least 8 characters"),
});
