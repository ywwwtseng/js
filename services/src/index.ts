import type { DeepPartial } from '@libs/types';

export type Action<TState = any, TTable = any> = {
  '@table'?: TTable;
  name: string;
  validate?: (params?: unknown) => boolean;
  state?: (state: Partial<TState>) => {
      path: string[];
      value: unknown;
  };
  execute?: (state: DeepPartial<TState> | undefined) => void;
  log?: boolean;
  effect?: (state: DeepPartial<TState>) => void;
};