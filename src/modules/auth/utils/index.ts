import { ERRORS } from 'src/common/errors';
import { AppException } from 'src/common/exceptions/app-exception';

const ms = require('ms');

export function getExpiresAt(expiresInEnvValue: string): Date {
  const msValue = ms(expiresInEnvValue);

  if (!msValue) {
    throw new AppException(ERRORS.INTERNAL_SERVER_ERROR);
  }

  return new Date(Date.now() + msValue);
}