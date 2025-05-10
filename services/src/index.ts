export type PathValue<
  TState,
  TPath extends [keyof TState, string] | [keyof TState, string, string]
> = 
  TPath extends [infer K extends keyof TState, infer K2 extends keyof TState[keyof TState]]
    ? TPath extends [K, K2]
      ? TState[K][K2]
      : TPath extends [K, K2, infer K3 extends keyof TState[K][K2]]
        ? TState[K][K2][K3]
        : never
    : never;

export type Action<
  TState,
  TPath extends [keyof TState, string] | [keyof TState, string, string] | undefined = undefined
> = {
  name: string;
  validate?: (params?: unknown) => boolean;
  state?: TPath extends undefined
    ? undefined
    : {
        path: TPath;
        value: (state: Pick<TState, keyof TState>) => PathValue<TState, NonNullable<TPath>>;
      };
  execute?: (state: TPath extends undefined ? undefined : PathValue<TState, NonNullable<TPath>>) => void;
  log?: boolean;
  effect?: (state: TPath extends undefined ? undefined : PathValue<TState, NonNullable<TPath>>) => void;
};