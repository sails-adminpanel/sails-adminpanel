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
                            if (searchStr.startsWith(">") || searchStr.startsWith("<")) {
                                if (Number.isNaN(parseFloat(searchStr.substring(1)))) {
                                    break;
                                }
                            }
                            if (searchStr.startsWith(">")) {
                                columnQuery = { [fieldsArray[parseInt(columnName)]]: { '>=': parseFloat(searchStr.substring(1)) } };
                            }
                            else if (searchStr.startsWith("<")) {
                                columnQuery = { [fieldsArray[parseInt(columnName)]]: { '<=': parseFloat(searchStr.substring(1)) } };
                            }
                            else {
                                if (!Number.isNaN(parseFloat(searchStr))) {
                                    columnQuery = { [fieldsArray[parseInt(columnName)]]: parseFloat(searchStr) };
                                }
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
            const totalRecords = await this.model.count();
            const filteredRecords = await this.model.count(queryOptions.where);
            //@ts-ignore todo rewrite for unuse populate chain instead populateAll 
            const data = await this.model.find(queryOptions).populateAll();
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
            let row = [elem[this.model.primaryKey ?? 'id']];
            Object.keys(this.fields).forEach((key) => {
                if (this.fields[key].config.displayModifier) {
                    row.push(this.fields[key].config.displayModifier(elem[key]));
                }
                else if (this.fields[key].model && this.fields[key].model.model) {
                    // Обработка связей типа "belongsTo"
                    if (!elem[key]) {
                        row.push(null);
                    }
                    else {
                        row.push(elem[key][this.fields[key].config.displayField]);
                    }
                }
                else if (this.fields[key].model.type === "association-many" || this.fields[key].model.type === "association") {
                    if (!elem[key] || elem[key].length === 0) {
                        row.push(null);
                    }
                    else {
                        let displayValues = [];
                        elem[key].forEach((item) => {
                            if (item[this.fields[key].config.displayField]) {
                                displayValues.push(item[this.fields[key].config.displayField]);
                            }
                            else {
                                displayValues.push(item[this.fields[key].config.identifierField]);
                            }
                        });
                        row.push(displayValues.join(', '));
                    }
                }
                else if (this.fields[key].model.type === "json") {
                    let str = JSON.stringify(elem[key]);
                    row.push(str === "{}" ? "" : str);
                }
                else {
                    row.push(elem[key]);
                }
            });
            out.push(row);
        });
        return out;
    }
}
exports.NodeTable = NodeTable;
