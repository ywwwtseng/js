import { use } from 'react';
import { TMAContext, TMAContextState } from './TMAContext';

export function useTMA<TState>(): TMAContextState<TState> {
  const context = use(TMAContext) as TMAContextState<TState>;

  if (!context) {
    throw new Error("useTMA must be used within a TMAProvider");
  }

  return context;
}