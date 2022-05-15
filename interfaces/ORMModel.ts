import {Callback} from "waterline";

/**
 * Описывает ORM представление
 */

type CreateDeleteBuilder = {
  fetch(): Promise<any>;
};

type UpdateBuilder = {
  fetch(): Promise<any>[];
};

type QueryBuilder = {
  where(condition: any): QueryBuilder;
  limit(lim: number): QueryBuilder;
  skip(num: number): QueryBuilder;
  sort(criteria: string | { [attribute: string]: string } | { [attribute: string]: string }[]): QueryBuilder;
  paginate(pagination?: { page: number; limit: number }): QueryBuilder;
  populate(association: string): QueryBuilder;
  populate(association: string, filter: any): QueryBuilder;
  populateAll(): QueryBuilder;
  groupBy(attrOrExpr: string): QueryBuilder;
  max(attribute: string): QueryBuilder;
  min(attribute: string): QueryBuilder;
  sum(attribute: string): QueryBuilder;
  average(attribute: string): QueryBuilder;
  meta(options: any): QueryBuilder;
};

export interface ORMModelData {
  [key: string]: string | boolean | number | object
}

export default interface ORMModel {
  create?(params: any): CreateDeleteBuilder;
  create?(params: any[]): CreateDeleteBuilder[];

  find?(criteria?: any): QueryBuilder;
  findOne?(criteria?: any): QueryBuilder;
  findOrCreate?(criteria?: any, values?: any): QueryBuilder;

  update?(criteria: any, changes: any): UpdateBuilder[];
  update?(criteria: any, changes: any[]): UpdateBuilder[];

  destroy?(criteria: any): CreateDeleteBuilder[];
  destroy?(criteria: any[]): CreateDeleteBuilder[];

  count?(criteria?: any): number;
  count?(criteria: any[]): number;

  query(sqlQuery: string, cb: Callback<any>): void;
  query(sqlQuery: string, data: any, cb: Callback<any>): void;
  native(cb: (err: Error, collection: any) => void): void;

  stream?(criteria: any, writeEnd: any): NodeJS.WritableStream | Error;

  attributes: any;
}
