"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTable = void 0;
class NodeTable {
    constructor(request, model, fields) {
        this.fieldsArray = ['actions'];
        this.request = request;
        this.model = model;
        this.fields = fields;
        this.fieldsArray = this.fieldsArray.concat(Object.keys(this.fields));
    }
    async limit() {
        let limit = [];
        if (this.request.start !== "" && this.request.length !== "") {
            limit = [parseInt(this.request.start), parseInt(this.request.length)];
        }
        return limit;
    }
    order() {
        if (this.request.order.length > 0) {
            let element = this.request.order[0];
            let columnIdx = parseInt(element.column);
            let requestColumn = this.request.columns[columnIdx];
            if (requestColumn && requestColumn.data && requestColumn.orderable === "true") {
                let columnName = requestColumn.data;
                if (columnName + "" === 0 + "") {
                    columnName = "1";
                }
                return `${this.fieldsArray[parseInt(columnName)]} ${element.dir.toUpperCase()}`;
            }
        }
        return undefined;
    }
    filter() {
        let globalSearch = [];
        let localSearch = [];
        let hasLocalSearch = false;
        if (typeof this.request.columns === 'object' && this.request.columns !== null) {
            for (const key in this.request.columns) {
                if (Object.prototype.hasOwnProperty.call(this.request.columns, key)) {
                    const column = this.request.columns[key];
                    if (column && column.search && column.search.value !== '') {
                        hasLocalSearch = true;
                        break;
                    }
                }
            }
        }
        if ((this.request.search !== undefined && this.request.search.value !== "") || hasLocalSearch) {
            let searchStrGlobal = this.request.search.value;
            const columns = this.request.columns;
            const fieldsArray = this.fieldsArray;
            for (let index = 0; index < columns.length; index++) {
                let searchStr = searchStrGlobal;
                let columnQuery = null;
                const requestColumn = columns[index];
                let isLocalSearch = false;
                if (hasLocalSearch && requestColumn['search']['value']) {
                    searchStr = requestColumn['search']['value'];
                    isLocalSearch = true;
                }
                const columnName = requestColumn.data;
                if (!searchStr)
                    continue;
                // Skip actions first column
                if (fieldsArray[parseInt(columnName)] === 'actions') {
                    continue;
                }
                if (requestColumn.searchable === "true") {
                    const fieldType = this.fields[fieldsArray[parseInt(columnName)]].model.type;
                    switch (fieldType) {
                        case 'boolean':
                            if (searchStr + "" === "true" || searchStr + "" === "false") {
                                columnQuery = { [fieldsArray[parseInt(columnName)]]: searchStr.toLowerCase() === 'true' };
                            }
                            break;
                        case 'number':
                            if (!Number.isNaN(parseFloat(searchStr))) {
                                columnQuery = { [fieldsArray[parseInt(columnName)]]: parseFloat(searchStr) };
                            }
                            break;
                        case 'string':
                            columnQuery = { [fieldsArray[parseInt(columnName)]]: { contains: searchStr } };
                            break;
                        default:
                            // Пропускаем json, ref и ассоциации
                            break;
                    }
                }
                if (columnQuery) {
                    if (isLocalSearch) {
                        localSearch.push(columnQuery);
                    }
                    else {
                        globalSearch.push(columnQuery);
                    }
                }
            }
        }
        let criteria = {};
        if (globalSearch.length || localSearch.length) {
            if (globalSearch.length) {
                criteria['or'] = globalSearch;
            }
            if (localSearch.length) {
                criteria['and'] = localSearch;
            }
        }
        return criteria;
    }
    async buildQuery() {
        const limit = await this.limit();
        const order = await this.order();
        const filter = await this.filter();
        return { where: filter, sort: order, skip: limit[0], limit: limit[1] };
    }
    async output(callback) {
        try {
            const queryOptions = await this.buildQuery();
            console.log(JSON.stringify(queryOptions, null, 2));
            const totalRecords = await this.model.count();
            const filteredRecords = await this.model.count(queryOptions.where);
            const data = await this.model.find(queryOptions);
            const output = {
                draw: this.request.draw !== "" ? this.request.draw : 0,
                recordsTotal: totalRecords,
                recordsFiltered: filteredRecords,
                data: this.mapData(data)
            };
            if (typeof callback === 'function') {
                callback(null, output);
            }
            else {
                throw new Error('Provide a callable function!');
            }
        }
        catch (error) {
            callback(error, null);
        }
    }
    mapData(data) {
        let out = [];
        data.forEach((elem) => {
            let row = [null];
            Object.keys(this.fields).forEach((key) => {
                if (elem[key]) {
                    row.push(elem[key]);
                }
                else {
                    row.push(null);
                }
            });
            out.push(row);
        });
        return out;
    }
}
exports.NodeTable = NodeTable;
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