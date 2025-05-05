interface RetrySettings<T> {
    retries: number;
    delay_ms?: number;
    condition?: (result: T) => boolean;
}
export declare const retry: <T>({ retries, delay_ms, condition, }: RetrySettings<T>) => (exec: () => Promise<T>) => Promise<T>;
export {};
