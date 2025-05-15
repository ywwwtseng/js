import { SignJWT, jwtVerify } from 'jose';
import { AppError, ErrorCodes } from '@libs/errors';
export const cookies = (headers) => {
    const cookieHeader = headers.get('cookie') || '';
    return Object.fromEntries(cookieHeader.split(';').map(cookie => {
        const [key, value] = cookie.trim().split('=');
        return [key, value];
    }));
};
export const sign = async (payload, expirationTime, token) => {
    const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expirationTime)
        .sign(new TextEncoder().encode(token));
};
export const verify = async (jwt, token) => {
    try {
        if (!jwt) {
            throw new AppError(ErrorCodes.INVALID_CREDENTIALS);
        }
        const { payload } = await jwtVerify(jwt, new TextEncoder().encode(token));
        return payload;
    }
    catch (error) {
        if (error.code === 'ERR_JWT_EXPIRED') {
            throw new AppError(ErrorCodes.TOKEN_EXPIRED, error.code);
        }
        throw new AppError(ErrorCodes.INVALID_CREDENTIALS);
    }
};
