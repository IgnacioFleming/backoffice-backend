import z from "zod";

export const productSchema = z.object({
  id: z.number(),
  name: z.string().max(50),
  price: z.number().nonnegative(),
  cost: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  category: z.string().max(50),
  description: z.string(),
  thumbnail: z.string().url().nullable().optional(),
  thumbnail_public_id: z.string().nullable().optional(),
});

export const productSchemaOptional = productSchema.partial({ thumbnail_public_id: true, thumbnail: true });
