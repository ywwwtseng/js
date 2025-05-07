// types.d.ts
import {
  AnyPgColumn,
  PgTableWithColumns,
} from 'drizzle-orm/pg-core';

export type ColumnSchema =
  | {
      type: 'varchar' | 'integer';
      opts?: { length: number };
      default?: number | string;
      primary?: boolean;
      notNull?: boolean;
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
    };


export type Schema = Record<string, ColumnSchema>;

/**
 * 建立資料表
 * @param name 資料表名稱
 * @param schema 欄位定義
 * @returns 資料表物件
 */
export declare function Table(
  name: string,
  schema: Schema
): PgTableWithColumns<any, Record<string, AnyPgColumn>>;
