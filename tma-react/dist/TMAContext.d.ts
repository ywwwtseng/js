import type { User, Platform } from '@telegram-apps/sdk-react';
import type { Action } from '@lib/api';
import { TonConnect } from './TonConnect';
export interface TMAContextState<TState = unknown> {
    user: User | undefined;
    platform: Platform | undefined;
    tonConnect: TonConnect | undefined;
    initDataRaw: string | null | undefined;
    avatar: HTMLImageElement | null;
    authorized: boolean;
    request: {
        get: <T>(url: string, options?: RequestInit) => Promise<T>;
        post: <T, U>(url: string, body?: U, options?: RequestInit) => Promise<T>;
        put: <T, U>(url: string, body?: U, options?: RequestInit) => Promise<T>;
        delete: <T, U>(url: string, body?: U, options?: RequestInit) => Promise<T>;
    };
    state: TState | undefined;
    t: (key: string, params?: Record<string, string | number>) => string;
    mutate: <TPayload>(mutation: string | Action<TState, TPayload>, payload?: unknown) => Promise<unknown>;
    isLoading: (mutation: string | Action<TState, any>) => boolean;
}
export declare const TMAContext: import("react").Context<TMAContextState<unknown>>;
