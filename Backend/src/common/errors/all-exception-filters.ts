import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CustomError } from '.';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof CustomError
        ? exception.code
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof CustomError
        ? exception.message
        : exception instanceof Error
          ? exception.message
          : 'Unexpected error';

    const key =
      exception instanceof CustomError ? exception.key : 'internalServerError';
    response.status(status).json({
      statusCode: status,
      message,
      key,
    });
  }
}
