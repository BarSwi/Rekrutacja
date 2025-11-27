import { z } from 'zod';

export const UnitEnum = z.enum(['pcs', 'sqm', 'cubm', 'mb', 'kg', 'bag']);

export const PaginationSchema = z.object({
  page: z.coerce.number().int().nonnegative().default(0),
  pageSize: z.coerce.number().int().positive().default(10),
});

export type Pagination = z.infer<typeof PaginationSchema>;
