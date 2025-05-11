import { SQLQuery } from 'bun';
export type StateValueReducer<TState, TValue, TPayload = unknown> = ((state: TState, payload: TPayload) => TValue | string) | TValue | string;
export type RecursiveStateReducer<TRootTState, TState, TPayload = unknown> = {
    [K in keyof TState]?: TState[K] extends object ? TState[K] extends Array<any> ? StateValueReducer<TRootTState, TState[K], TPayload> : RecursiveStateReducer<TRootTState, TState[K], TPayload> | StateValueReducer<TRootTState, TState[K], TPayload> : StateValueReducer<TRootTState, TState[K], TPayload>;
};
export declare const join: (temp: SQLQuery | undefined, fragment: SQLQuery) => SQLQuery;
export declare const receive: <TState>(telegram_id: string, table: keyof TState) => Promise<any>;
export declare const set: (id: string, path: string[], value: unknown) => Promise<{
    [x: string]: any;
}>;
export declare const update: <TState, TPayload = unknown>(id: string, reducer: RecursiveStateReducer<TState, TState, TPayload>, table: keyof TState, state: Pick<TState, keyof TState>, payload: TPayload) => Promise<{
    [x: string]: any;
}>;
