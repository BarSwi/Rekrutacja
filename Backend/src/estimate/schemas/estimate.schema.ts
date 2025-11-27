import { z } from 'zod';
import { IdParamsSchema } from '../../common/schemas/id-validator.schema';

export const CreateEstimateSchema = z
  .object({
    name: z.string().min(1).max(255),
  })
  .strip();

export { IdParamsSchema };

export const UpdateEstimateSchema = z
  .object(CreateEstimateSchema.shape)
  .partial();

export type CreateEstimate = z.infer<typeof CreateEstimateSchema>;
export type UpdateEstimate = z.infer<typeof UpdateEstimateSchema>;
