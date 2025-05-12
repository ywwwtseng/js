import type { RecursiveStateReducer } from '@libs/model';
export type Action<TState, TPayload = unknown> = {
    type: string;
    validate?: (state: TState, payload: TPayload) => boolean;
    reducer?: RecursiveStateReducer<TState, TState, TPayload>;
    effect?: (state: TState | undefined, payload: TPayload) => void;
    log?: boolean;
};
export declare const headers: (options?: Record<string, string>) => {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Methods': string;
    'Access-Control-Allow-Headers': string;
};
