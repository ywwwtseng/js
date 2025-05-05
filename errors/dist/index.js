export const ErrorCodes = {
    // 400xx - Bad Request Errors
    INVALID_PARAMS: 40001,
    REWARD_NOT_AVAILABLE: 40002,
    REWARD_NOT_QUALIFIED: 40003,
    NOT_ENOUGH_ENERGY: 40004,
    // 401xx - Authentication Errors
    SESSION_MISMATCH: 40101,
    SESSION_EXPIRED: 40102,
    INVALID_TOKEN: 40103,
    TOKEN_EXPIRED: 40104,
    INVALID_CREDENTIALS: 40105,
    INVALID_SIGNATURE: 40106,
    // 403xx - Authorization Errors
    INSUFFICIENT_PERMISSIONS: 40301,
    COMING_SOON: 40302,
    SYSTEM_MAINTENANCE: 40303,
    BLACKLIST_USER: 40304,
    WITHDRAWAL_RESTRICTION: 40305,
    // 404xx - Not Found Errors
    NOT_FOUND: 40401,
    USER_NOT_FOUND: 40402,
    RESOURCE_NOT_FOUND: 40403,
    USER_TON_WALLET_NOT_FOUND: 40404,
    // 409xx - Conflict Errors
    // DUPLICATE_ENTRY: 40901,
    // VERSION_CONFLICT: 40902,
    ALREADY_EXISTED: 40901,
    INSUFFICIENT_BALANCE: 40902,
    NOT_SUPPORT: 40903,
    MANY_REQUESTS: 40904,
    // 500xx - Internal Server Errors
    INTERNAL_SERVER_ERROR: 50001,
};
export const ErrorMessages = {
    // 400xx - Bad Request Errors
    [ErrorCodes.INVALID_PARAMS]: 'Invalid parameters',
    [ErrorCodes.REWARD_NOT_AVAILABLE]: 'Reward not available',
    [ErrorCodes.REWARD_NOT_QUALIFIED]: 'Reward not qualified',
    [ErrorCodes.NOT_ENOUGH_ENERGY]: 'Not enough energy',
    // 401xx - Authentication Errors
    [ErrorCodes.SESSION_MISMATCH]: 'Session ID does not match',
    [ErrorCodes.SESSION_EXPIRED]: 'Session expired',
    [ErrorCodes.INVALID_TOKEN]: 'Invalid token',
    [ErrorCodes.INVALID_CREDENTIALS]: 'Invalid credentials',
    [ErrorCodes.INVALID_SIGNATURE]: 'Invalid signature',
    // 403xx - Authorization Errors
    [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
    [ErrorCodes.COMING_SOON]: 'Coming soon',
    [ErrorCodes.SYSTEM_MAINTENANCE]: 'System maintenace',
    [ErrorCodes.BLACKLIST_USER]: 'Blacklist user',
    [ErrorCodes.WITHDRAWAL_RESTRICTION]: 'Withdrawal functionality has been restricted',
    // 404xx - Not Found Errors
    [ErrorCodes.NOT_FOUND]: 'Not Found',
    [ErrorCodes.USER_NOT_FOUND]: 'User not found',
    [ErrorCodes.RESOURCE_NOT_FOUND]: 'Resource not found',
    [ErrorCodes.USER_TON_WALLET_NOT_FOUND]: 'User\'s ton wallet not found',
    // 409xx - Conflict Errors
    [ErrorCodes.ALREADY_EXISTED]: 'Already existed',
    [ErrorCodes.INSUFFICIENT_BALANCE]: 'Insufficient balance',
    [ErrorCodes.NOT_SUPPORT]: 'Not support',
    [ErrorCodes.MANY_REQUESTS]: 'Too many requests. Please try again later',
    // 500xx - Internal Server Errors
    [ErrorCodes.INTERNAL_SERVER_ERROR]: 'Unexpected error: Internal server error',
};
export class AppError extends Error {
    status;
    cause;
    constructor(code, message, status = Math.floor(code / 100)) {
        super(message
            || ErrorMessages[code]
            || ErrorMessages[ErrorCodes.INTERNAL_SERVER_ERROR]);
        this.status = status;
        this.cause = {
            code,
            status: this.status,
        };
    }
}
