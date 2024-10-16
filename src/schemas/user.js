import z from "zod";
import { userRoles } from "../utils/roles.js";

export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(3).max(30),
  password: z.string().min(3).max(100),
  first_name: z.string().min(1).max(63),
  last_name: z.string().min(1).max(63),
  role: z.enum(Object.values(userRoles)),
  is_enabled: z.boolean(),
});
