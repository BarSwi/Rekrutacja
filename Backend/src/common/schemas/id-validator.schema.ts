import { z } from 'zod';

const MONGODB_OBJECTID_REGEX = /^[a-f\d]{24}$/;
const UUID_REGEX =
  /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;

export function createIdParamSchema(fieldName: string = 'id') {
  return z
    .object({
      [fieldName]: z
        .string()
        .refine(
          (val) => MONGODB_OBJECTID_REGEX.test(val) || UUID_REGEX.test(val),
          { message: 'Invalid ID format' },
        ),
    })
    .strip();
}

export const IdParamsSchema = createIdParamSchema('id');
