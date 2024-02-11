import { Model } from 'sails';
import { ModelConfig } from '../../interfaces/adminpanelConfig';
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
    value: string, 
    regex: 'true' | 'false' | boolean 
  }

}

interface Search {
  value: string;
}

export class NodeTable {
  public request: Request;
  public model: Model;
  public fields: Fields;
  public fieldsArray: string[] = ['actions']

  constructor(request: Request, model: Model, fields: Fields) {
    this.request = request;
    this.model = model;
    this.fields = fields;
    this.fieldsArray = this.fieldsArray.concat(Object.keys(this.fields));
  }

  async limit(): Promise<number[]> {
    let limit: number[] = [];
    if (this.request.start !== "" && this.request.length !== "") {
      limit = [parseInt(this.request.start), parseInt(this.request.length)];
    }
    return limit;
  }

  order(): string {
    if (this.request.order.length > 0) {
      let element = this.request.order[0]
      let columnIdx = parseInt(element.column);
      let requestColumn = this.request.columns[columnIdx];
      if (requestColumn && requestColumn.data && requestColumn.orderable === "true") {
        let columnName = requestColumn.data;
        if (columnName + "" === 0 + "") {
          columnName = "1"
        }
        return `${this.fieldsArray[parseInt(columnName)]} ${element.dir.toUpperCase()}`
      }
    }
    return undefined;
  }


  filter(): any {
    let globalSearch: any = []; 
    let localSearch: any = []; 

    const hasLocalSearch = this.request.columns.every(item => item.search.value === '') === false;

    if ((this.request.search !== undefined && this.request.search.value !== "") || hasLocalSearch) {
      let searchStrGlobal = this.request.search.value;
      const columns = this.request.columns;
      const fieldsArray = this.fieldsArray;
  
      for (let index = 0; index < columns.length; index++) {
        let searchStr = searchStrGlobal;
        let columnQuery: any = null
        const requestColumn = columns[index];
        let isLocalSearch = false
        if(hasLocalSearch && requestColumn['search']['value']){
          searchStr = requestColumn['search']['value'];
          isLocalSearch = true;
        }

        const columnName = requestColumn.data;
        if(!searchStr) continue;


        // Skip actions first column
        if(fieldsArray[parseInt(columnName)]=== 'actions') {
          continue;
        }

        if (requestColumn.searchable === "true") {
          const fieldType = this.fields[fieldsArray[parseInt(columnName)]].model.type;

          switch (fieldType) {
            case 'boolean':
              if(searchStr+"" === "true" || searchStr+"" === "false") {
                columnQuery = { [fieldsArray[parseInt(columnName)]]: searchStr.toLowerCase() === 'true' };
              }
              break;
            case 'number':
              if(!Number.isNaN(parseFloat(searchStr))){
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

        if(columnQuery){
          if(isLocalSearch) {
            localSearch.push(columnQuery)
          } else {
            globalSearch.push(columnQuery)
          }
        }
      }
    }
  
    let criteria = {}
    if(globalSearch.length || localSearch.length) {
      if(globalSearch.length) {
        criteria['or'] = globalSearch
      } 
      if(localSearch.length) {
        criteria['and'] = localSearch
      }

    }
    return criteria;
  }



  async buildQuery(): Promise<any> {
    const limit = await this.limit();
    const order = await this.order();
    const filter = await this.filter();

    return { where: filter, sort: order, skip: limit[0], limit: limit[1] };
  }

  async output(callback: Function): Promise<void> {
    try {
      const queryOptions = await this.buildQuery();
      console.log(JSON.stringify(queryOptions, null, 2))
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
      } else {
        throw new Error('Provide a callable function!');
      }
    } catch (error) {
      callback(error, null);
    }
  }

  mapData(data: { [key: string]: any }): object[] {
    let out: object[] = [];
    data.forEach((elem: any) => {
      let row: any = [null];
      Object.keys(this.fields).forEach((key: string) => {
        if (elem[key]) {
          row.push(elem[key]);
        } else {
          row.push(null);
        }
      });
      out.push(row);
    });

    return out;
  }
}