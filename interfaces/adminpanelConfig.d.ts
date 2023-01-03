type FieldsTypes = "string" | "password" | "date" | "datetime" | "time" | "integer" | "number" | "float" | "color" | "email" | "month" | "week" | "range" | "boolean" | "binary" | "text" | "longtext" | "mediumtext" | "ckeditor" | "wysiwyg" | "texteditor" | "word" | "jsoneditor" | "json" | "array" | "object" | "ace" | "html" | "xml" | "aceeditor" | "image" | "images" | "file" | "files" | "menu" | "navigation" | "schedule" | "worktime" | "association" | "association-many" | "select" | "select-many" | "table"

export interface AdminpanelConfig {
    /** prepare to impl dashboard*/
    dashboard?: any
    theme?: string
    /**
     * Enable or disable auth for adminpanel
     */
    auth?: boolean
    /**
     * @alpha
     * Models configuration
     * @todo rewrite for EntityType
     * reference upload contoroller ~50 line
     * */
    models: {
        [key:string]: ModelConfig
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
    scripts?: {
        header?: string[]
        footer?: string[]
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
        path?: string
        defaultLocale: string
    } | boolean
    /**
     * Forms
     * */
    forms?: {
        path?: string
        /**
         * TODO: (wizards) rewrite to data -> setup
         * same for model (need entity config types)
         * */
        data: {
            [key:string]: FieldsForms
        }
        /**
         * Custom getter
         * */
        get?: Function
        /**
         * Custom setter
         * */
        set?: Function
    }
    /**
     * Wizards
     * */
    wizards?: {
        path: string
        data: {
            [key:string]: FieldsModels
        }
        /**
         * Custom getter
         * */
        get?: Function
        /**
         * Custom setter
         * */
        set?: Function
    }
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

    /**
     *
     * System field for store absolute root path adminpanel hookfolder
     */
    rootPath?:string
}

export interface ModelConfig {
    title: string
    /**
     * Model name
     * */
    model: string
    /**
     * Hide entity in left navbar
     * */
    hide?: boolean
    /**
     * Entity fields configuration
     * */
    fields?: FieldsModels
    /**
     * List display configuration
     * */
    list?: {
        /**
         * Configuration for models' fields that will be displayed on 'list' page
         * */
        fields?: FieldsModels
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
     * Entity actions displayed in left navbar for specific entity
     * */
    tools?: HrefConfig[]
    /**
     * Entity icon
     * */
    icon?: string
    /**
     * Force set primary key
     * */
    identifierField?: string
}

export interface FieldsForms {
    [key: string]: FormFieldConfig
}

export interface FieldsModels {
    [key: string]: boolean | string | BaseFieldConfig
}

interface FormFieldConfig extends BaseFieldConfig {
    value?: any
}

interface BaseFieldConfig {
    title?: string
    type?: FieldsTypes
    /**
     * Field description
     * */
    tooltip?: string
    /**
     * Options for widgets like 'Navigation', 'Schedule' and 'FileUploader'
     * */
    options?: NavigationOptionsField | ScheduleOptionsField | FileUploaderOptionsField | any
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
    /**
     * Field that will be used only in select and select-pure widget
     * */
    isIn?: object

    /** Show as disabled element HTML */
    disabled?: boolean
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
     * forbid/allow adding new property in pop-up
     * */
    disableAddingProperty?: boolean
    /**
     * forbid/allow deleting new property in pop-up
     * */
    disableDeletingProperty?: boolean
    /**
     * add list of properties that can be chosen
     * */
    propertyList?: {
        [key: string]: {
            type: string
            title: string
            description?: string
            required?: string
            options?: Function
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

export interface CreateUpdateConfig {
    fields?: FieldsModels
    /**
     * callback for data modification before saving record
     *
     * Function(reqData) {return reqData}
     * */
    entityModifier?: Function
    /**
     * You can change standard controller for any entity by this property
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
    accessRightsToken?: string,
    /**
     * For menu items only
     * */
    subItems?: HrefConfig[]
}
