import { createContext } from 'react';
import type { User, Platform } from '@telegram-apps/sdk-react';
import { TonConnect } from './TonConnect';

export interface TMAContextState {
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
  state: unknown;
}

export const TMAContext = createContext<TMAContextState | undefined>(undefined);
