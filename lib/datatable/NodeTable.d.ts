import { Fields } from '../../helper/fieldsHelper';
import { AbstractModel } from '../v4/model/AbstractModel';
import { DataAccessor } from "../v4/DataAccessor";
interface Request {
    start: string;
    length: string;
    order: Order[];
    columns: Column[];
    search: Search;
    draw: string;
}
interface Order {
    column: string;
    dir: string;
}
interface Column {
    data: string;
    searchable: string;
    orderable: string;
    search: {
        value: string;
        regex: 'true' | 'false' | boolean;
    };
}
interface Search {
    value: string;
}
interface NodeOutput {
    draw: string | number;
    recordsTotal: number;
    recordsFiltered: number;
    data: object[];
}
export declare class NodeTable {
    request: Request;
    model: AbstractModel<any>;
    fields: Fields;
    fieldsArray: string[];
    constructor(request: Request, model: AbstractModel<any>, fields: Fields);
    limit(): Promise<number[]>;
    order(): string;
    filter(): any;
    buildQuery(): Promise<any>;
    output(callback: (err: Error, output: NodeOutput) => void, dataAccessor: DataAccessor): Promise<void>;
    mapData(data: {
        [key: string]: any;
    }): object[];
}
export {};
