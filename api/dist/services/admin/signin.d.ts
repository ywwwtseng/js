export interface SigninOptions {
    jwt: {
        expirationTime: string;
        payload?: (telegram_id: string) => Promise<Record<string, any>>;
    };
}
export declare const signin: (options: SigninOptions) => {
    '/api/admin/signin': {
        GET: (req: Bun.BunRequest<"/api/admin/signin">) => Promise<Response>;
    };
};
