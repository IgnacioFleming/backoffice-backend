import z from "zod";

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(50),
  price: z.number().nonnegative(),
  stock: z.number().nonnegative(),
  category: z.string().max(50),
  description: z.string(),
  thumbnail: z.string().url(),
});
