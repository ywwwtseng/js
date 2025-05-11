import { sql } from 'bun';
import * as object from '@libs/object';
export const join = (temp, fragment) => {
    return temp ? sql `${temp}, ${sql `${fragment}`}` : sql `${fragment}`;
};
export const receive = async (telegram_id, table) => {
    const result = await sql `
    SELECT * FROM ${sql(table)} WHERE id = ${telegram_id};
  `;
    return result[0];
};
export const set = async (id, path, value) => {
    if (path.length === 3) {
        const result = await sql `
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
    }
    else {
        const result = await sql `
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
export const update = async (id, reducer, table, state, payload) => {
    if (!reducer)
        return {};
    let returning;
    let sets;
    for (const key in reducer[table]) {
        returning = join(returning, sql(key));
        const updater = reducer[table][key];
        if (object.is(updater)) {
            let expr = sql `${sql(key)}`;
            for (const jsonKey in updater) {
                const jsonUpdater = updater[jsonKey];
                const jsonValue = typeof jsonUpdater === 'function'
                    ? sql `${sql(jsonUpdater(state, payload))}`
                    : sql `${sql(jsonUpdater)}`;
                expr = sql `jsonb_set(${expr}, '{${sql(jsonKey)}}', '${jsonValue}', true)`;
            }
            const jsonSets = sql `${sql(key)} = ${expr}`;
            if (jsonSets) {
                sets = join(sets, jsonSets);
            }
        }
        else if (typeof updater === 'function') {
            const rawUpdater = updater(state, payload);
            if (typeof rawUpdater === 'string' && rawUpdater.includes('=')) {
                sets = join(sets, sql `${sql.unsafe(rawUpdater)}`);
            }
            else {
                sets = join(sets, sql `${sql(key)} = ${updater(state, payload)}`);
            }
        }
        else if (typeof updater === 'string' && updater.includes('=')) {
            sets = join(sets, sql `${sql.unsafe(updater)}`);
        }
        else {
            sets = join(sets, sql `${sql(key)} = ${updater}`);
        }
    }
    const result = await sql `
    UPDATE ${sql(table)}
    SET ${sets}
    WHERE id = ${id}
    RETURNING ${returning}
  `;
    return {
        [table]: result[0]
    };
};
