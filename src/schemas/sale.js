import z from "zod";

export const saleSchema = z.object({
  id: z.number().int().positive(),
  order_number: z.number().int().positive(),
  costumer_id: z.number().int().positive(),
  items_quantity: z.number().int().nonnegative(),
  total_amount: z.number().nonnegative(),
  is_payed: z.boolean(),
  is_delivered: z.boolean(),
});
