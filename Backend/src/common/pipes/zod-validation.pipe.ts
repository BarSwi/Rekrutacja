import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodSchema } from 'zod';
import { CustomError, ErrorCodes, ErrorKeys } from '../errors';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error: any) {
      const formattedErrors = error?.issues?.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      console.log(formattedErrors);
      throw new CustomError(
        ErrorCodes.VALIDATION_ERROR,
        ErrorKeys.VALIDATION_ERROR,
        'Validation failed',
        formattedErrors,
      );
    }
  }
}
