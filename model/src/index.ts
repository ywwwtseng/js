import { sql } from 'bun';

export const update = async (id: string, path: string[], value: unknown) => {
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
        ${sql(path[1])} = ${value}
      WHERE
        id = ${id}
      RETURNING ${sql(path[1])};
    `;

    return {
      [path[0]]: result[0]
    };
  }
};