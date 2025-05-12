import type { RecursiveStateReducer } from '@libs/model';

export type Action<TState, TPayload = unknown> = {
  type: string;
  validate?: (state: TState, payload: TPayload) => boolean;
  reducer?: RecursiveStateReducer<TState, TState, TPayload>;
  effect?: (state: TState | undefined, payload: TPayload) => void;
  log?: boolean;
};


export const headers = (options?: Record<string, string>) => ({
  // 'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  ...options,
});