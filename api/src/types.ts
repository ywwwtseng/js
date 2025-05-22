import type { RecursiveStateReducer } from '@lib/model';

export type Action<TState, TPayload = unknown> = {
  type: string;
  validate?: (state: TState, payload: TPayload) => boolean;
  reducer?: RecursiveStateReducer<TState, TPayload>;
  effect?: (state: TState, payload: TPayload) => void;
  log?: boolean;
};
