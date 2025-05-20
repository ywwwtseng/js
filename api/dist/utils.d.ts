export declare const cookies: (headers: Headers) => {
    [k: string]: string;
};
export declare const sign: (payload: Record<string, any>, expirationTime: string, token: string) => Promise<string>;
export declare const verify: (jwt: string, token: string) => Promise<import("jose").JWTPayload>;
