import { validate } from '@lib/tma-init-data';
import { AppError, ErrorCodes } from '@lib/errors';
import * as object from '@lib/object';
import * as model from '@lib/model';
import type { Action } from '../../types';

export const mutation = <
  TState extends Record<keyof TState, any>,
  TActions extends Record<keyof TState, Action<TState, unknown>>,
>({
  updates,
  actions,
}: {
  updates: string[];
  actions: TActions;
}) => ({
  '/api/update': {
    POST: async (req: Bun.BunRequest<'/api/update'>) => {
      const { telegram_id } = await validate(req.headers);
      const body = await req.json();


      if (!updates.includes(body.path.join('.'))) {
        throw new AppError(ErrorCodes.INVALID_PARAMS);
      }

      const result = await model.set(telegram_id, body.path, body.value);

      return Response.json({ data: result });
    },
  },
  '/api/action': {
    POST: async (req: Bun.BunRequest<'/api/action'>) => {
      const { telegram_id } = await validate(req.headers);
      const body = await req.json();
      const action = actions[body.type as keyof TActions];

      if (!action) {
        throw new AppError(ErrorCodes.INVALID_PARAMS);
      }

      let result: any;
      let state: Pick<TState, keyof TState> | undefined;

      if (action.reducer) {
        const table = Object.keys(action.reducer)[0] as keyof TState;
        state = {
          [table]: await model.receive(telegram_id, table)
        } as Pick<TState, keyof TState>;

        if (action.validate) {
          action.validate(state, body.payload);
        }

        result = await model.update(
          telegram_id,
          action.reducer,
          table,
          state,
          body.payload,
        );
      }

      if (action.effect) {
        action.effect(
          Boolean(state && result) ? object.merge(state, result) : undefined,
          body.payload,
        );
      }

      return Response.json({ data: result || {} });
    },
  }
});