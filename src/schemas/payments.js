import z from "zod";

export const paymentSchema = z.object({
  costumer_id: z.number().int().positive(),
  payment_amount: z.number().positive(),
});
