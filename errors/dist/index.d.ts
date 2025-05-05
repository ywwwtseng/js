export declare const ErrorCodes: {
    readonly INVALID_PARAMS: 40001;
    readonly REWARD_NOT_AVAILABLE: 40002;
    readonly REWARD_NOT_QUALIFIED: 40003;
    readonly NOT_ENOUGH_ENERGY: 40004;
    readonly SESSION_MISMATCH: 40101;
    readonly SESSION_EXPIRED: 40102;
    readonly INVALID_TOKEN: 40103;
    readonly TOKEN_EXPIRED: 40104;
    readonly INVALID_CREDENTIALS: 40105;
    readonly INVALID_SIGNATURE: 40106;
    readonly INSUFFICIENT_PERMISSIONS: 40301;
    readonly COMING_SOON: 40302;
    readonly SYSTEM_MAINTENANCE: 40303;
    readonly BLACKLIST_USER: 40304;
    readonly WITHDRAWAL_RESTRICTION: 40305;
    readonly NOT_FOUND: 40401;
    readonly USER_NOT_FOUND: 40402;
    readonly RESOURCE_NOT_FOUND: 40403;
    readonly USER_TON_WALLET_NOT_FOUND: 40404;
    readonly ALREADY_EXISTED: 40901;
    readonly INSUFFICIENT_BALANCE: 40902;
    readonly NOT_SUPPORT: 40903;
    readonly MANY_REQUESTS: 40904;
    readonly INTERNAL_SERVER_ERROR: 50001;
};
export declare const ErrorMessages: {
    readonly 40001: "Invalid parameters";
    readonly 40002: "Reward not available";
    readonly 40003: "Reward not qualified";
    readonly 40004: "Not enough energy";
    readonly 40101: "Session ID does not match";
    readonly 40102: "Session expired";
    readonly 40103: "Invalid token";
    readonly 40105: "Invalid credentials";
    readonly 40106: "Invalid signature";
    readonly 40301: "Insufficient permissions";
    readonly 40302: "Coming soon";
    readonly 40303: "System maintenace";
    readonly 40304: "Blacklist user";
    readonly 40305: "Withdrawal functionality has been restricted";
    readonly 40401: "Not Found";
    readonly 40402: "User not found";
    readonly 40403: "Resource not found";
    readonly 40404: "User's ton wallet not found";
    readonly 40901: "Already existed";
    readonly 40902: "Insufficient balance";
    readonly 40903: "Not support";
    readonly 40904: "Too many requests. Please try again later";
    readonly 50001: "Unexpected error: Internal server error";
};
export declare class AppError extends Error {
    readonly status: number;
    cause: {
        code: number;
        status: number;
    };
    constructor(code: number, message?: string, status?: number);
}
