import z from "zod";

export const orderSchema = z.object({
  id: z.number(),
  order_number: z.number().int().nonnegative(),
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  amount: z.number().nonnegative(),
});
