import ORMModel from "./ORMModel";

export interface AdminpanelConfig {
    instances: {
        [key:string]: InstanceConfig
    }
    sections: HrefConfig[]
    routePrefix: string
    pathToViews: string
    identifierField: string
    menu: {
        brand: boolean | string | HrefConfig
        /**
         * will be created at the bottom of the sidenav panel
         * */
        actions: HrefConfig[]
    }
    styles: string[]
    script: {
        header: string[]
        footer: string[]
    }
    welcome?: {
        title: string
        text: string
    }
}

export interface Instance {
    name: string
    config: InstanceConfig
    model: ORMModel
    uri: string
}

export interface InstanceConfig {
    title: string
    model: string
    fields: Fields
    list?: { fields: Fields } | boolean
    add?: CreateUpdateConfig | boolean
    edit?: CreateUpdateConfig | boolean
    remove?: boolean
    view?: boolean
    actions?: HrefConfig[]
    icon?: string,
    /**
     * force set primary key
     * */
    identifierField?: string
}

export interface Fields {
    [key: string]: BaseFieldConfig | boolean | string
}

interface BaseFieldConfig {
    title?: string
    type: FieldsTypes
    tooltip?: string
    options?: NavigationOptionsField | ScheduleOptionsField | FileUploaderOptionsField
    displayModifier?: Function
}

interface NavigationOptionsField {
    maxNestedItems?: number
    displacementControl?: boolean
    propertyList?: {
        [key: string]: {
            type: string
            title: string
            description?: string
            required?: string
        }
    }
    visibleElement?: string | false
    titleProperties?: string
}

interface ScheduleOptionsField {
    supportOldVersion?: boolean
    propertyList?: {
        [key: string]: {
            type: string
            title: string
            description?: string
            required?: string
        }
    }
    permutations?: {
        time?: boolean
        date?: boolean
        break?: boolean
        options?: boolean
    }
}

interface FileUploaderOptionsField {
    filesize?: number
    small?: number
    large?: number
    accepted?: string[]
}

declare enum FieldsTypes {
    string = 'string', password = 'password', date = 'date', datetime = 'datetime', time = 'time', integer = 'integer',
    number = 'number', float = 'float', color = 'color', email = 'email', month = 'month', week = 'week',
    range = 'range', boolean = 'boolean', binary = 'binary', text = 'text', longtext = 'longtext',
    mediumtext = 'mediumtext', ckeditor = 'ckeditor', wysiwyg = 'wysiwyg', texteditor = 'texteditor', word = 'word',
    jsoneditor = 'jsoneditor', json = 'json', array = 'array', object = 'object', ace = 'ace', html = 'html',
    xml = 'xml', aceeditor = 'aceeditor', image = 'image', images = 'images', file = 'file', files = 'files',
    menu = 'menu', navigation = 'navigation', schedule = 'schedule', worktime = 'worktime', association = 'association',
    "association-many" = 'association-many'
}

export interface CreateUpdateConfig {
    fields: Fields,
        /**
         * callback for data modification before saving record
         *
         * function(reqData) {return reqData}
         * */
        instanceModifier?: Function
}

export interface HrefConfig {
    title: string
    link: string
    icon?: string
}
