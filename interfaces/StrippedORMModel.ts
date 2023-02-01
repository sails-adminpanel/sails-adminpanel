import {Callback} from "waterline";

/**
 * As we generate adminpanel by models from config, we cannot pass model in generic
 */

type CRUDBuilder = {
  fetch(): Promise<any>;
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

export default interface StrippedORMModel {
  create?(params: any): CRUDBuilder;
  create?(params: any[]): CRUDBuilder;

  find?(criteria?: any): QueryBuilder;
  findOne?(criteria?: any): QueryBuilder;
  findOrCreate?(criteria?: any, values?: any): QueryBuilder;

  update?(criteria: any, changes: any): CRUDBuilder;
  update?(criteria: any, changes: any[]): CRUDBuilder;

  destroy?(criteria: any): CRUDBuilder;
  destroy?(criteria: any[]): CRUDBuilder;
  destroyOne?(criteria: any[]): CRUDBuilder;

  count?(criteria?: any): number;
  count?(criteria: any[]): number;

  query(sqlQuery: string, cb: Callback<any>): void;
  query(sqlQuery: string, data: any, cb: Callback<any>): void;
  native(cb: (err: Error, collection: any) => void): void;

  stream?(criteria: any, writeEnd: any): NodeJS.WritableStream | Error;

  attributes: any;
}
