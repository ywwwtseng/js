import { validate } from '@telegram-apps/init-data-node';
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
export const validateInitData = async (headers, token, alwaysPass = false) => {
    const authorization = headers['authorization'];
    if (!authorization || !authorization.includes('tma')) {
        throw new AppError(ErrorCodes.INVALID_CREDENTIALS, 'Authorization header is missing or invalid');
    }
    const initData = new URLSearchParams(authorization.replace('tma ', ''));
    try {
        if (!alwaysPass) {
            validate(initData, token);
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
            language_code: user.language_code?.toLowerCase()?.slice(0, 2) || null,
            start_param: parseStartParam(initData.get('start_param')),
        };
    }
    catch {
        throw new AppError(ErrorCodes.INVALID_CREDENTIALS);
    }
};
