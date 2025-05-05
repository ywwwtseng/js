import { validate } from '@telegram-apps/init-data-node';
import { parse } from '@libs/json';
import { AppError, ErrorCodes } from '@libs/errors';

export enum StartParamType {
  NONE = 'n',
  REFERRAL = 'r',
  PARTNER = 'p',
}

export const parseStartParam = (startParam: string | null) => {
  if (!startParam) {
    return {
      type: StartParamType.NONE,
      value: null,
    };
  }

  const [type, value] = startParam.split('_');

  if (!value) {
    return {
      type: StartParamType.NONE,
      value: null,
    };
  }

  return {
    type,
    value,
  };
};

export const validateInitData = async (
  headers: Record<string, string | undefined>,
  token: string,
  alwaysPass: boolean = false,
) => {
  const authorization = headers['authorization'];

    if (!authorization || !authorization.includes('tma')) {
      throw new AppError(ErrorCodes.INVALID_CREDENTIALS, 'Authorization header is missing or invalid');
    }

    const initData = new URLSearchParams(authorization.replace('tma ', ''));

    try {
      if (!alwaysPass) {
        validate(initData, token);
      }

      const user = parse(initData.get('user')!) as {
        id: number,
        username: string,
        first_name: string,
        last_name: string,
        photo_url: string,
        language_code: string,
      };

      if (!user) {
        throw new AppError(ErrorCodes.INVALID_CREDENTIALS, 'User not found');
      }

      return {
        telegram_id: String(user.id),
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        photo_url: user.photo_url || null,
        language_code: user.language_code?.toLowerCase()?.slice(0, 2) || null,
        start_param: parseStartParam(initData.get('start_param')),
      };
    } catch {
      throw new AppError(ErrorCodes.INVALID_CREDENTIALS);
    }
};
