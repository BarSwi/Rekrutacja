import { z } from 'zod';
import { ItemType } from '../../models/estimate.mongo.schema';
import { createIdParamSchema } from '../../common/schemas/id-validator.schema';

export const ItemParamsSchema = createIdParamSchema('itemId');

export const SingleItemParamsSchema = z
  .object({
    ...createIdParamSchema('estimateId').shape,
    ...createIdParamSchema('itemId').shape,
  })
  .strip();

const MaterialSchema = z
  .object({
    type: z.literal(ItemType.MATERIAL),
    name: z.string().min(1).max(255),
    quantity: z.number().positive(),
    unit: z.string().min(1),
    unitPrice: z.number().nonnegative(),
    totalPrice: z.number().optional(),
  })
  .strip();

const ServiceSchema = z
  .object({
    type: z.literal(ItemType.SERVICE),
    name: z.string().min(1).max(255),
    totalPrice: z.number().positive(),
  })
  .strip();

export const CreateSingleItemSchema = z.discriminatedUnion('type', [
  MaterialSchema,
  ServiceSchema,
]);

export const UpdateSingleItemSchema = z.discriminatedUnion('type', [
  MaterialSchema.partial().required({ type: true }),
  ServiceSchema.partial().required({ type: true }),
]);

export type CreateSingleItemDto = z.infer<typeof CreateSingleItemSchema>;
export type UpdateSingleItemDto = z.infer<typeof UpdateSingleItemSchema>;
