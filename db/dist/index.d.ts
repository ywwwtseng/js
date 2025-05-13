import {
  PgTableWithColumns,
} from 'drizzle-orm/pg-core';


export type Writable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type JsonbShape<T extends Record<string, { type: string }>> = Writable<{
  [K in keyof T]:
    T[K]['type'] extends 'string' ? string :
    T[K]['type'] extends 'number' ? number :
    T[K]['type'] extends 'boolean' ? boolean :
    unknown;
}>;

export type ColumnSchema =
  | {
      type: 'varchar' ;
      opts?: { length: number };
      default?: string;
      primary?: boolean;
      notNull?: boolean;
      references?: { table: string, column: string };
      index?: boolean;
      uniqueIndex?: boolean;
    }
  | {
      type: 'integer';
      opts?: { length: number };
      default?: number;
      primary?: boolean;
      notNull?: boolean;
      references?: { table: string, column: string };
      index?: boolean;
      uniqueIndex?: boolean;
    }
  | {
      type: 'decimal';
      opts?: { precision: number; scale: number };
      default?: string;
      notNull?: boolean;
    }
  | {
      type: 'jsonb';
      notNull?: boolean;
      shape?: Record<string, { type: string }>
    }
  | {
      type: 'timestamp';
      opts?: { precision?: number };
      notNull?: boolean;
      default?: { fn: string }
    };

export type TypeMap<T extends ColumnSchema = any> = {
  varchar: string;
  integer: number;
  decimal: number;
  jsonb: T extends { shape: infer S extends Record<string, { type: string }> }
    ? JsonbShape<S>
    : any;
  timestamp: Date;
};

export type BaseType<T extends ColumnSchema> = TypeMap<T>[T['type']];

export type IsRequired<T extends ColumnSchema> =
  T extends { notNull: true } ? true
  : T extends { default: any } ? true
  : T extends { primary: true } ? true
  : false;

export type InferField<T extends ColumnSchema> =
  IsRequired<T> extends true ? BaseType<T> : BaseType<T> | null;

export type InferSchema<T extends Record<string, ColumnSchema | any>> = Writable<{
  [K in keyof T as K extends `@${string}` ? never : K]:
    T[K] extends ColumnSchema ? InferField<T[K]> : never;
}>;

type Schema = {
  '@table': string;
  [key: string]: ColumnSchema | string;
};

export declare function Table(
  name: string,
  schemas: Record<string, Schema>,
  tables?: Record<string, PgTableWithColumns<any>>,
): PgTableWithColumns<any>;

export declare function Tables(
  schemas: Record<string, Schema>
): Record<string, PgTableWithColumns<any>>;
