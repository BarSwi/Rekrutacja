export enum ErrorCodes {
  INTERNL_SERVER_ERROR = 500,
  VALIDATION_ERROR = 400,
}

export enum ErrorKeys {
  INTERNAL_SERVER_ERROR = 'internalServerError',
  VALIDATION_ERROR = 'validationError',
}

export class CustomError extends Error {
  constructor(
    public code: ErrorCodes,
    public key: ErrorKeys,
    message?: string,
  ) {
    super(message);
  }
}
