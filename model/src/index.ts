import { sql, SQLQuery } from 'bun';
import * as object from '@libs/object';

export type StateValueReducer<TState, TValue, TPayload = unknown> =
  | ((state: TState, payload: TPayload) => TValue | string)
  | TValue
  | string;

export type RecursiveStateReducer<TRootTState, TState, TPayload = unknown> = {
  [K in keyof TState]?: TState[K] extends object
    ? TState[K] extends Array<any>
      ? StateValueReducer<TRootTState, TState[K], TPayload>
      : RecursiveStateReducer<TRootTState, TState[K], TPayload> | StateValueReducer<TRootTState, TState[K], TPayload>
    : StateValueReducer<TRootTState, TState[K], TPayload>;
};

export const join = (temp: SQLQuery | undefined, fragment: SQLQuery) => {
  return temp ? sql`${temp}, ${sql`${fragment}`}` : sql`${fragment}`;
};

export const receive = async <TState>(telegram_id: string, table: keyof TState) => {
  const result = await sql`
    SELECT * FROM ${sql(table)} WHERE id = ${telegram_id};
  `;

  return result[0];
};

export const set = async (id: string, path: string[], value: unknown) => {
  if (path.length === 3) {
    const result = await sql`
      UPDATE
        ${sql(path[0])}
      SET
        ${sql(path[1])} = jsonb_set(
          ${sql(path[1])}, '{${sql(path[2])}}', '${sql(value)}', true
        )
      WHERE
        id = ${id}
      RETURNING ${sql(path[1])};
    `;

    return {
      [path[0]]: result[0]
    };
  } else {
    const result = await sql`
      UPDATE
        ${sql(path[0])}
      SET 
        ${sql(path[1])} = ${sql(value)}
      WHERE
        id = ${id}
      RETURNING ${sql(path[1])};
    `;

    return {
      [path[0]]: result[0]
    };
  }
};

export const update = async <TState, TPayload = unknown>(
  id: string,
  reducer: RecursiveStateReducer<TState, TState, TPayload>,
  table: keyof TState,
  state: Pick<TState, keyof TState>,
  payload: TPayload,
) => {
  if (!reducer) return {};

  let returning: SQLQuery | undefined;
  let sets: SQLQuery | undefined;

  for (const key in reducer[table]) {
    returning = join(returning, sql(key));

    const updater = reducer[table][key];

    if (object.is(updater)) {
      let expr: SQLQuery = sql`${sql(key)}`;

      for (const jsonKey in updater) {
        const jsonUpdater = updater[jsonKey];
        const jsonValue = typeof jsonUpdater === 'function'
          ? sql`${sql(jsonUpdater(state, payload))}`
          : sql`${sql(jsonUpdater)}`;
      
        expr = sql`jsonb_set(${expr}, '{${sql(jsonKey)}}', '${jsonValue}', true)`;
      }
      
      const jsonSets = sql`${sql(key)} = ${expr}`;

      if (jsonSets) {
        sets = join(sets, jsonSets);
      }


    } else if (typeof updater === 'function') {
      const rawUpdater = updater(state, payload);

      if (typeof rawUpdater === 'string' && rawUpdater.includes('=')) {
        sets = join(sets, sql`${sql.unsafe(rawUpdater)}`);
      } else {
        sets = join(sets, sql`${sql(key)} = ${updater(state, payload)}`);
      }
    } else if (typeof updater === 'string' && updater.includes('=')) {
      sets = join(sets, sql`${sql.unsafe(updater)}`);
    } else {
      sets = join(sets, sql`${sql(key)} = ${updater}`);
    }
  }

  const result = await sql`
    UPDATE ${sql(table)}
    SET ${sets}
    WHERE id = ${id}
    RETURNING ${returning}
  `;

  return {
    [table]: result[0]
  };
};