import { env } from 'bun';
import * as InitDataNode from '@telegram-apps/init-data-node';
import { parse } from '@libs/json';
import { AppError, ErrorCodes } from '@libs/errors';
export var StartParamType;
(function (StartParamType) {
    StartParamType["NONE"] = "n";
    StartParamType["REFERRAL"] = "r";
    StartParamType["PARTNER"] = "p";
})(StartParamType || (StartParamType = {}));
export const parseStartParam = (startParam) => {
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
export const validate = async (headers) => {
    const authorization = headers['authorization'];
    if (!authorization || !authorization.includes('tma')) {
        throw new AppError(ErrorCodes.INVALID_CREDENTIALS, 'Authorization header is missing or invalid');
    }
    const initData = new URLSearchParams(authorization.replace('tma ', ''));
    try {
        if (env.NODE_ENV !== 'development') {
            if (!env.TELEGRAM_BOT_TOKEN) {
                throw new AppError(ErrorCodes.INTERNAL_SERVER_ERROR, 'env.TELEGRAM_BOT_TOKEN is not configured');
            }
            InitDataNode.validate(initData, env.TELEGRAM_BOT_TOKEN);
        }
        const user = parse(initData.get('user'));
        if (!user) {
            throw new AppError(ErrorCodes.INVALID_CREDENTIALS, 'User not found');
        }
        return {
            telegram_id: String(user.id),
            username: user.username || '',
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            photo_url: user.photo_url || null,
            language_code: user.language_code || null,
            start_param: parseStartParam(initData.get('start_param')),
        };
    }
    catch {
        throw new AppError(ErrorCodes.INVALID_CREDENTIALS);
    }
};
