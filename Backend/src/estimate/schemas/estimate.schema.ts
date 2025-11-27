import { z } from 'zod';

export const CreateEstimateSchema = z
  .object({
    name: z.string().min(1).max(255),
  })
  .strip();
export const IdParamsSchema = z
  .object({
    id: z
      .string()
      .refine(
        (val) =>
          /^[a-f\d]{24}$/.test(val) ||
          /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/.test(
            val,
          ),
        { message: 'Invalid ID format' },
      ),
  })
  .strip();
export const UpdateEstimateSchema = z
  .object(CreateEstimateSchema.shape)
  .partial();

export type CreateEstimate = z.infer<typeof CreateEstimateSchema>;
export type UpdateEstimate = z.infer<typeof UpdateEstimateSchema>;
