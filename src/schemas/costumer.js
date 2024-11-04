import z from "zod";

export const costumerSchema = z.object({
  id: z.number(),
  name: z.string().max(50),
  account_number: z.number().nonnegative(),
  logo: z.string().url(),
  logo_public_id: z.string(),
});

export const costumerOptionalSchema = costumerSchema.partial({ logo_public_id: true });
