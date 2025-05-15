import type { Action } from '../../types';
export declare const mutation: <TState extends Record<keyof TState, any>, TActions extends Record<keyof TState, Action<TState, unknown>>>({ updates, actions, }: {
    updates: string[];
    actions: TActions;
}) => {
    '/api/update': {
        POST: (req: Bun.BunRequest<"/api/update">) => Promise<Response>;
    };
    '/api/action': {
        POST: (req: Bun.BunRequest<"/api/action">) => Promise<Response>;
    };
};
