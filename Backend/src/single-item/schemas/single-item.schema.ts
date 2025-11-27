import { z } from 'zod';
import { UnitEnum } from '../../common/schemas/pagination.schema';
export const ItemTypeEnum = z.enum(['material', 'service']);
const BaseItemSchema = z.object({
  estimateId: z.string().uuid(),
  name: z.string().min(1).max(255),
});

const MaterialSchema = BaseItemSchema.extend({
  type: ItemTypeEnum.refine((val) => val === 'material', {
    message: "type must be 'material'",
  }),
  quantity: z.number().positive(),
  unit: UnitEnum,
  unitPrice: z.number().nonnegative(),
}).strict();

const ServiceSchema = BaseItemSchema.extend({
  type: ItemTypeEnum.refine((val) => val === 'service', {
    message: "type must be 'service'",
  }),
  totalPrice: z.number().positive(),
}).strict();

export const CreateSingleItemSchema = z.discriminatedUnion('type', [
  MaterialSchema,
  ServiceSchema,
]);

const UpdateMaterialSchema = BaseItemSchema.extend({
  type: ItemTypeEnum.refine((val) => val === 'material', {
    message: "type must be 'material'",
  }),
  quantity: z.number().positive(),
  unit: UnitEnum,
  unitPrice: z.number().nonnegative(),
})
  .partial()
  .strict();

const UpdateServiceSchema = BaseItemSchema.extend({
  type: ItemTypeEnum.refine((val) => val === 'service', {
    message: "type must be 'service'",
  }),
  totalPrice: z.number().positive(),
})
  .partial()
  .strict();

export const UpdateSingleItemSchema = z.discriminatedUnion('type', [
  UpdateMaterialSchema,
  UpdateServiceSchema,
]);

export const UpdateSingleItemParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CreateSingleItem = z.infer<typeof CreateSingleItemSchema>;
export type UpdateSingleItem = z.infer<typeof UpdateSingleItemSchema>;
