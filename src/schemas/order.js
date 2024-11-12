import z from "zod";

export const orderSchema = z.object({
  id: z.number(),
  sale_id: z.number().int().nonnegative(),
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  amount: z.number().nonnegative(),
  order_cost: z.number().nonnegative().optional(),
});
