// types.d.ts
import {
  PgTableWithColumns,
} from 'drizzle-orm/pg-core';

export type ColumnSchema =
  | {
      type: 'varchar' | 'integer';
      opts?: { length: number };
      default?: number | string;
      primary?: boolean;
      notNull?: boolean;
      references?: { table: string, column: string };
      index?: boolean;
      uniqueIndex?: boolean;
    }
  | {
      type: 'decimal';
      opts: { precision: number; scale: number };
      default?: string;
      notNull?: boolean;
    }
  | {
      type: 'jsonb';
      notNull?: boolean;
    }
  | {
      type: 'timestamp';
      opts?: { precision?: number };
      notNull?: boolean;
      default?: { fn: string }
    }
  | string;


export type Schema = Record<string, ColumnSchema>;

export declare function Table(
  name: string,
  schemas: Record<string, Schema>,
  tables?: Record<string, PgTableWithColumns<any>>,
): PgTableWithColumns<any>;

export declare function Tables(
  schemas: Record<string, Schema>
): Record<string, PgTableWithColumns<any>>;
