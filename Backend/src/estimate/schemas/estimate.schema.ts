import { z } from 'zod';

export const CreateEstimateSchema = z
  .object({
    name: z.string().min(1).max(255),
  })
  .strip();
export const UpdateSingleItemParamsSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strip();
export const UpdateEstimateSchema = z
  .object(CreateEstimateSchema.shape)
  .partial();

export type CreateEstimate = z.infer<typeof CreateEstimateSchema>;
export type UpdateEstimate = z.infer<typeof UpdateEstimateSchema>;
