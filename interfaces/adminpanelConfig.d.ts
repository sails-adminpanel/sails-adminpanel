export interface AdminpanelConfig {
    /**
     * Instances configuration
     * */
    instances: {
        [key:string]: InstanceConfig
    }
    /**
     * For custom adminpanel sections, displays inside header
     * */
    sections?: HrefConfig[]
    /**
     * Route prefix for adminpanel, admin by default
     * */
    routePrefix?: string
    pathToViews?: string
    /**
     * Force set primary key
     * */
    identifierField?: string
    brand?: {
        link: boolean | string | HrefConfig
    }
    /**
     * Left-side navigation bar
     * */
    navbar?: {
        /**
         * will be created at the bottom of the sidenav panel
         * */
        additionalLinks: HrefConfig[]
    }
    /**
     * Policies that will be executed before going to every page
     * */
    policies?: string | string[] | Function | Function[]
    styles?: string[]
    script?: {
        header: string[]
        footer: string[]
    }
    /**
     * Text for welcome page
     * */
    welcome?: {
        title?: string
        text?: string
    }
    /**
     * Text translation using sails built-in internationalization
     * */
    translation?: {
        /**
         * Locales list
         * */
        locales: string[]
        /**
         * Relative path from project root to translations folder
         * */
        path: string
        defaultLocale: string
    } | boolean
    /**
     * Prime administrator login credentials
     * */
    administrator?: {
        login: string
        password: string
    }
    /**
     * Enable/disable displaying createdAt and updatedAt fields in `edit` and `add` sections
     * */
    showORMtime?: boolean
    /**
     * Adminpanel package.json config
     * */
    package?: any
    /**
     * Available timezones list
     * */
    timezones?: {
        id: string
        name: string
    }[]
    /**
     * Show adminpanel version on the bottom of navbar
     * */
    showVersion?: boolean
}

export interface InstanceConfig {
    title: string
    /**
     * Model name
     * */
    model: string
    /**
     * Instance fields configuration
     * */
    fields?: Fields
    /**
     * List display configuration
     * */
    list?: {
        /**
         * Configuration for models' fields that will be displayed on 'list' page
         * */
        fields: Fields
        /**
         * Actions configuration that will be displayed
         * */
        actions?: {
            global?: HrefConfig[]
            inline?: HrefConfig[]
        }
    } | boolean
    /**
     * Configuration for 'create model' action or disabling/enabling it
     * */
    add?: CreateUpdateConfig | boolean
    /**
     * Configuration for 'update model' action or disabling/enabling it
     * */
    edit?: CreateUpdateConfig | boolean
    /**
     * Disabling/enabling 'delete model' action
     * */
    remove?: boolean
    /**
     * Disabling/enabling 'read model' action
     * */
    view?: boolean
    /**
     * Instance actions displayed in left navbar for specific instance
     * */
    tools?: HrefConfig[]
    /**
     * Instance icon
     * */
    icon?: string
    /**
     * Force set primary key
     * */
    identifierField?: string
}

export interface Fields {
    [key: string]: BaseFieldConfig | boolean | string
}

interface BaseFieldConfig {
    title?: string
    type: FieldsTypes
    /**
     * Field description
     * */
    tooltip?: string
    /**
     * Options for widgets like 'Navigation', 'Schedule' and 'FileUploader'
     * */
    options?: NavigationOptionsField | ScheduleOptionsField | FileUploaderOptionsField
    /**
     * Function that makes data modification on list view
     * */
    displayModifier?: Function
    /**
     * Force set primary key
     * */
    identifierField?: string
    /**
     * Label for associations
     * */
    displayField?: string
}

interface NavigationOptionsField {
    /**
     * max number of nested elements
     * */
    maxNestedItems?: number
    /**
     * forbid/allow using sortable if element has inserted elements
     * */
    displacementControl?: boolean
    /**
     * add list of properties that can be chosen
     * */
    propertyList?: {
        [key: string]: {
            type: string
            title: string
            description?: string
            required?: string
        }
    }
    /**
     * Set visibility to elements, can be set to string properties 'visible' or 'hidden'. Set boolean property 'false' to turn off this property
     * */
    visibleElement?: string | false
    /**
     * set the property, that would be title of the element
     * */
    titleProperties?: string
}

interface ScheduleOptionsField {
    supportOldVersion?: boolean
    /**
     * add list of properties that can be chosen
     * */
    propertyList?: {
        [key: string]: {
            type: string
            title: string
            description?: string
            required?: string
        }
    }
    /**
     * forbid or allow displaying data, time or break fields
     * */
    permutations?: {
        time?: boolean
        date?: boolean
        break?: boolean
        /**
         * forbid or allow displaying the pop-up (modal window)
         * */
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
    fields?: Fields
    /**
     * callback for data modification before saving record
     *
     * function(reqData) {return reqData}
     * */
    instanceModifier?: Function
    /**
     * You can change standard controller for any instance by this property
     * */
    controller?: string
}

export interface HrefConfig {
    id: string
    title: string
    link: string
    icon?: string
    /**
     * Only for view, controller still uses his own access rights token
     * */
    accessRightsToken?: string
}
