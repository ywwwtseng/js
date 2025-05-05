interface IpInfo {
    ip: string | undefined;
    country: string | undefined;
    city: string | undefined;
    loc: string | undefined;
    timezone: string | undefined;
}
export declare const ipAddress: (headers: Headers | Record<string, string | undefined>) => string;
export declare const ipinfo: (headers: Headers | Record<string, string | undefined>) => Promise<IpInfo>;
export {};
