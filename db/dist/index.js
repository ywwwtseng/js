import {
  pgTable,
  varchar,
  integer,
  decimal,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

const drizzleTypes = {
  varchar,
  integer,
  decimal,
  jsonb,
  timestamp,
};

function generateTableColumns(name, schema, tables) {
  const columns = {};
  for (const [key, def] of Object.entries(schema)) {
    if (typeof def === 'object' && def.type) {
      const fn = drizzleTypes[def.type];
      let col = fn(key, def.opts ?? {});
      if (def.notNull) col = col.notNull();
      if (def.default !== undefined) {
        col = def.default.fn === 'now' ? col.defaultNow() : col.default(def.default);
      }
      if (def.primary) col = col.primaryKey();

      if (def.references && tables) {
        if (def.references.table === name) {
          const table = pgTable(schema['@table'], generateTableColumns(name, schema));
          col = col.references(() => table[def.references.column]);
        } else {
          col = col.references(() => tables[def.references.table][def.references.column]);
        }

      }
      columns[key] = col;
    }
  }

  return columns;
}

export function Table(name, schemaMap, tables) {
  const schema = schemaMap[name];
  return pgTable(
    schema['@table'],
    generateTableColumns(name, schema, tables),
    (table) => Object.entries(schema)
      .filter(([, def]) => typeof def === 'object' && (def.index || def.uniqueIndex))
      .map(([key, def]) => def.index ? index(`${key}_idx`).on(table[key]): uniqueIndex(`${key}_idx`).on(table[key])),
  );
};

export function Tables(schemaMap) {
  const tables = {};

  for (const key in schemaMap) {
    if (Object.prototype.hasOwnProperty.call(schemaMap, key)) {
      tables[key] = Table(key, schemaMap, tables);
    }
  }

  return tables;
}
