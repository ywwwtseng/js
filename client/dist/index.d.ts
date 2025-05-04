interface ClientOptions {
    baseUrl?: string;
    headers?: Record<string, string>;
    transformRequest?: (headers: Headers) => Headers;
    onResponse?: (res: Response) => void;
    onError?: <T>(res: Response, data: T) => void;
}
export declare class Client {
    baseUrl: string;
    headers?: Record<string, string>;
    transformRequest?: (headers: Headers) => Headers;
    onResponse?: (res: Response) => void;
    onError?: <T>(res: Response, data: T) => void;
    constructor({ baseUrl, headers, transformRequest, onResponse, onError }?: ClientOptions);
    request<T>(url: string, options?: RequestInit): Promise<T>;
    get<T>(url: string, options?: RequestInit): Promise<T>;
    post<T, U = unknown>(url: string, body?: U, options?: RequestInit): Promise<T>;
    put<T, U = unknown>(url: string, body?: U, options?: RequestInit): Promise<T>;
    delete<T, U = unknown>(url: string, body?: U, options?: RequestInit): Promise<T>;
}
export {};
