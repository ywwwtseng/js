import { AppError, ErrorCodes } from '@libs/errors';
export const headers = (options) => ({
    // 'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    ...options,
});
export const init = (env, keys) => {
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
