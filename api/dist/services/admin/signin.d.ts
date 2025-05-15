export declare const signin: (options: {
    jwt: {
        expirationTime: string;
    };
}) => {
    '/api/admin/signin': {
        GET: (req: Bun.BunRequest<"/api/admin/signin">) => Promise<Response>;
    };
};
