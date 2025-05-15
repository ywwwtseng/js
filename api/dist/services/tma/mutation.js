import { validate } from '@libs/tma-init-data';
import { AppError, ErrorCodes } from '@libs/errors';
import * as object from '@libs/object';
import * as model from '@libs/model';
export const mutation = ({ updates, actions, }) => ({
    '/api/update': {
        POST: async (req) => {
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
        POST: async (req) => {
            const { telegram_id } = await validate(req.headers);
            const body = await req.json();
            const action = actions[body.type];
            if (!action) {
                throw new AppError(ErrorCodes.INVALID_PARAMS);
            }
            let result;
            let state;
            if (action.reducer) {
                const table = Object.keys(action.reducer)[0];
                state = {
                    [table]: await model.receive(telegram_id, table)
                };
                if (action.validate) {
                    action.validate(state, body.payload);
                }
                result = await model.update(telegram_id, action.reducer, table, state, body.payload);
            }
            if (action.effect) {
                action.effect(Boolean(state && result) ? object.merge(state, result) : undefined, body.payload);
            }
            return Response.json({ data: result || {} });
        },
    }
});
