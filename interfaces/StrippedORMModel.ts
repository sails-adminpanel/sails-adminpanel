/**
 * As we generate adminpanel by models from config, we cannot pass model in generic
 */


type CRUDBuilder = {
  fetch(): Promise<any>;
};

export type SailsModelAnyField = number | string | boolean | Date | Array<number | string | boolean> | { [key: string]: number | string | boolean | Date };

export type SailsModelAnyInstance = {
    [key: string]: SailsModelAnyField
}

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
} & SailsModelAnyInstance;

export default interface StrippedORMModel {
  create?(params: any): CRUDBuilder;
  create?(params: any[]): CRUDBuilder;

  find?(criteria?: any): QueryBuilder;
  findOne?(criteria?: any): QueryBuilder;
  findOne?(criteria?: any): QueryBuilder;
  findOrCreate?(criteria?: any, values?: any): QueryBuilder;

  update?(criteria: any, changes: any): CRUDBuilder;
  update?(criteria: any, changes: any[]): CRUDBuilder;

  destroy?(criteria: any): CRUDBuilder;
  destroy?(criteria: any[]): CRUDBuilder;
  destroyOne?(criteria: any[]): CRUDBuilder;
  destroyOne?(criteria: string | number): CRUDBuilder;


  count?(criteria?: any): number;
  count?(criteria: any[]): number;

  query(sqlQuery: string, cb: Function): void;
  query(sqlQuery: string, data: any, cb: Function): void;
  native(cb: (err: Error, collection: any) => void): void;

  stream?(criteria: any, writeEnd: any): NodeJS.WritableStream | Error;

  attributes: SailsModelAnyInstance;
}
