import { SQLQuery } from 'bun';
export type IsPlainObject<T> = T extends object ? T extends Function ? false : T extends Array<any> ? false : true : false;
export type StateValueReducer<TCurrentState, TValue, TPayload = unknown> = ((state: TCurrentState, payload: TPayload) => TValue | string) | TValue | string;
export type RecursiveStateReducer<TCurrentState, TPayload = unknown, TState = TCurrentState> = {
    [K in keyof TState]?: TState[K] extends Array<any> ? StateValueReducer<TCurrentState, TState[K], TPayload> : IsPlainObject<TState[K]> extends true ? RecursiveStateReducer<TCurrentState, TPayload, TState[K]> : StateValueReducer<TCurrentState, TState[K], TPayload>;
};
export declare const join: (temp: SQLQuery | undefined, fragment: SQLQuery) => SQLQuery;
export declare const receive: <TState>(telegram_id: string, table: keyof TState) => Promise<any>;
export declare const set: (id: string, path: string[], value: unknown) => Promise<{
    [x: string]: any;
}>;
export declare const update: <TState, TPayload = unknown>(id: string, reducer: RecursiveStateReducer<TState, TPayload>, table: keyof TState, state: Pick<TState, keyof TState>, payload: TPayload) => Promise<{
    [x: string]: any;
}>;
