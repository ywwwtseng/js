import { AppError, ErrorCodes } from '@lib/errors';

export const init = (env: any, keys: string[]) => {
  const missing = [];

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];

    if (env[key] === undefined) {
      missing.push(key);
    }
  }

  if (missing.length !== 0) {
    throw new AppError(ErrorCodes.INTERNAL_SERVER_ERROR, `Missing env (${missing.toString()})`);
  }
};