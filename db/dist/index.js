import {
  pgTable,
  varchar,
  integer,
  decimal,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';

const drizzleTypes = {
  varchar,
  integer,
  decimal,
  jsonb,
  timestamp,
};

export function Table(name, schema) {
  // 🛠 generate columns
  const columns = {};
  for (const [key, def] of Object.entries(schema)) {
    const fn = drizzleTypes[def.type];
    let col = fn(key, def.opts ?? {});
    if (def.notNull) col = col.notNull();
    if (def.default !== undefined) {
      col = def.default.fn === 'now' ? col.defaultNow() : col.default(def.default);
    }
    if (def.primary) col = col.primaryKey();
    columns[key] = col;
  }

  return pgTable(name, columns);
}
