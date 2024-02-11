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
/**
 *
 *
 * TODO: Implement adminonael features
 *
 *
 * records = await waterlineExec(query);

    let identifierField = ConfigHelper.getIdentifierField(entity.config.model);
    let keyFields = Object.keys(fields);
    let result = [];

    records.reverse().forEach((entity) => {
        let a = [];
        a.push(entity[identifierField]); // Push ID for Actions
        keyFields.forEach((key) => {
            let fieldData = "";
            let displayField = fields[key].config.displayField;
            if(fields[key].model.model){
                if (!entity[key]){
                    fieldData = ""
                } else {
                    // Model
                    fieldData = entity[key][displayField];
                }
            } else if (fields[key].model.collection) {
                if (!entity[key] || !entity[key].length) {
                    fieldData = ""
                }
                else {
                    // Collection
                    entity[key].forEach((item)=>{
                        if (fieldData !== "") fieldData += ", "
                        fieldData += !item[displayField] ? item[fields[key].config.identifierField] : item[displayField];
                    })
                }

            } else {
                // Plain data
                fieldData = entity[key];
            }

            if (typeof fields[key].config.displayModifier === "function") {
                a.push(fields[key].config.displayModifier(entity[key]));
            } else {
                a.push(fieldData);
            }
        });
        result.push(a);
    });

    res.json({
        data: result
    });
 */ 
