import { Model } from 'sails';
import { Fields } from '../../helper/fieldsHelper';
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
export declare class NodeTable {
    request: Request;
    model: Model;
    fields: Fields;
    fieldsArray: string[];
    constructor(request: Request, model: Model, fields: Fields);
    limit(): Promise<number[]>;
    order(): string;
    filter(): any;
    buildQuery(): Promise<any>;
    output(callback: Function): Promise<void>;
    mapData(data: {
        [key: string]: any;
    }): object[];
}
export {};
