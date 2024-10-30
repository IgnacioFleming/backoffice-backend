import z from "zod";

export const saleSchema = z.object({
  id: z.number().int().positive(),
  costumer_id: z.number().int().positive(),
  items_quantity: z.number().int().nonnegative(),
  total_amount: z.number().nonnegative(),
});
