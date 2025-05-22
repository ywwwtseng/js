import { SignJWT, jwtVerify } from 'jose';
import { AppError, ErrorCodes } from '@lib/errors';

export const cookies = (headers: Headers) => {
  const cookieHeader = headers.get('cookie') || '';
  return Object.fromEntries(
    cookieHeader.split(';').map(cookie => {
      const [key, value] = cookie.trim().split('=');
      return [key, value];
    })
  );
};

export const sign = async (payload: Record<string, any>, expirationTime: string, token: string) => {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(new TextEncoder().encode(token));

  return jwt;
};

export const verify = async (jwt: string, token: string) => {
  try {
    if (!jwt) {
      throw new AppError(ErrorCodes.INVALID_CREDENTIALS, 'Missing token');
    }

    const { payload } = await jwtVerify(
      jwt,
      new TextEncoder().encode(token)
    );
  
    return payload;
  } catch (error) {
    throw new AppError(ErrorCodes.INVALID_CREDENTIALS, JSON.stringify(error));
  }
};