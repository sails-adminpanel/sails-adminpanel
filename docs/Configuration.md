# Admin Panel configuration

[Full adminpanel configuration schema](#configuration-schema)

## Global configs

Admin panel configuration consist of this options:

| Option            | Description
|-------------------|--------------------------
| `routePrefix`     | Route prefix for admin panel. Default: `/admin`
| `linkAssets`      | Will create a symlink to Admin panel assets. Anyway AP will try to load all assets from /admin/**** and you could copy them manually
| `identifierField` | Default identifier field into models. This field will be used as identifier. Default: `id`
| `models`       | Configuration for models. Read below...
| `showORMtime`     | Set `true` for enable showing fields createdAt and updatedAt in edit and add sections
## Models

Admin panel divided into `models` and this is a main part of configuration.

Model will represent several actions for each model that you need to enable into Admin Panel.
It will consist of actions:

+ `list` - list of records with filters, pagination and sorting.
+ `add` - add a new records
+ `edit` - editing of record
+ `view` - view details of record
+ `remove` - ability to remove record

Every model configuration should be placed into `models` block into `config/adminpanel.js` file.
And have a required property `model`.

```
module.exports.adminpanel = {
    models: {

        users: { // key. No matter what you will write here. just follow JS rules for objects
            title: 'Users', // If not defined will be taken from key. Here will be `users`
            model: 'User', // !!! required !!!
        }
    }
};
```

## Actions configuration

Every action into model could be configured separately.
Actions configuration shuold be placed into `model` block.

```
module.exports.adminpanel = {
    models: {

        users: { // key. No matter what you will write here. just follow JS rules for objects
            title: 'Users', // If not defined will be taken from key. Here will be `users`
            model: 'User', // !!! required !!!

            //  ==== Actions configuration here ====
        }
    }
};
```

Every action could be configured in several ways, **but it should have action key** (list/add/edit/view/remove):

+ `boolean` - Enable/disable functionality.
```
models: {
    users: {
        // ...

        list: true, // will mean that list action should exist. Enabled by default.
        edit: false // Will disable edit functionality for model.
    }
}
```

+ `object` - detailed configuration of action.

```
models: {
    users: {
        list: {
            limit: 15, // will set a limit of actions. This option supports only list action !
            fields: {} // list of fields configuration
        }
    }
}
```


## Fields configuration

For now AdminPanel hook supports 3 notations into field configuration:

+ Boolean notation

```
fieldName: true // will enable field showing/editing
fieldName: false // will remove field from showing. Could be usefull for actions like edit
```

+ String natation

```
fieldName: "Field Ttitle"
```

+ Object notation

```
fieldName: {
    title: "Field title", // You can overwrite field title
    type: "string", //you can overwrite default field type in admin panel
    required: true, // you can mark field required or not
    tooltip: 'tooltip for field', // You can define tooltip for field 
    editor: true, // you can add WYSTYG editor for the field in admin panel
}
```

**There are several places for field config definition and an inheritance of field configs.**

+ You could use a global `fields` property into `config/adminpanel.js` file into `models` section.
+ You could use `fields` property into `models:action` confguration. This config will overwrite global one

```
module.exports.adminpanel = {
    models: {
        users: {
            title: 'Users', // Menu title for model
            model: 'User', // Model definition for model

            fields: {
                email: 'User Email', // It will define title for this field in all actions (list/add/edit/view)
                createdAt: false, // Will hide createdAt field in all actions
                avatar: {
                    displayModifier: function (img) { // Only for list view  look callback.md for get more info
                        return `<img src="${img}">`              
                    }
                },
                bio: {
                    title: 'User bio',
                    type: 'text', // LOOK BELOW FOR TYPES DESCRIPTION
                    editor: true
                } // will set title `User bio` for the field and add editor into add/edit actions. Could be combined only with `text` type
            },
            // Action level config
            list: {
                bio: false // will hide bio field into list view
            },

            edit: {
                createdAt: 'Created at' //will enable field `createdAt` and set title to `Created at`
            }
        }
    }
}
```

## Hide model

You can hide model from left navbar using `hide` option.

```javascript
module.exports.adminpanel = {
    models: {
        users: {
            title: 'Users', // Menu title for model
            model: 'User', // Model definition for model
            hide: true
        }
    }
}
```

## Ignored fields
You could add ignored fields to action using `fields` config option.

```javascript
module.exports.adminpanel = {
    models: {
        users: {
            title: 'Users', // Menu title for model
            model: 'User', // Model definition for model

            // this fields will be ignored into all actions
            fields: {
                'admin': false,
                'someAnotherField': false,
                'encryptedPassword': false
            }
        }
    }
}
```

## Field types

Field types could be set into `field` configuration or will be inherited from your model definition.

Now Admin panel supports several field types and add proper editor for every type.

Types included into admin panel:
+ `string` - textfield into add/edit actions
+ `string` with `isIn` - selectbox
+ `password` - password field
+ `date` - input type date
+ `datetime` - input type datetime
+ `integer` / `float` - input type number
+ `boolean` - checkbox
+ `text` - textarea
+ `select` - html select

**If you will conbine `text` type with `editor` option for the field admin panel will create a WYSTYG editor for this field.**

## Select box

Sails.js Hook adminpanel supports selectboxes.

If you have `isIn` field in your model it will be displayed into adminpanel as a select box.
You can overwrite `isIn` title using fields configurations:

Example:

Your model:
```javascript
module.exports = {
    attributes: {
        gender: {
            type: 'string',
            isIn: ['male', 'female'],
            required: true
        }
    }
};
```

Your admin panel configuration:
```javascript
module.exports.adminpanel = {
    models: {
        users: {
            title: 'Users', // Menu title for model
            model: 'User', // Model definition for model

            fields: {
                'gender': {
                    isIn: {
                        male: 'Male',
                        female: 'Female'
                    }
                }
            }
        }
    }
}
```

## Associations

Now Adminpanel hook partially supports assotiations.

Adminpanel determinates such fields by waterline configuration.
Right now if you model field have such configuration:

```javascript
fieldName: {
    model: 'SomeModel'
}
```

Admin panel will create select list for `add/edit` actions and will populate record for `list/view` actions.

Available configuration options:
+ `title` - Default title option
+ `identifierField` - **Optional** Identifyer field name that will be stored into field. Default: `id`
+ `displayField` - **Optional** Field name that will be used to show record name. *Will be displayed into select list*. Default: `id`

Example:
```javascript
owner: {
    title: 'Owner',
    identifierField: 'id',
    displayField: 'email' // Owner emails will be displayed into list and view/list screen
}
```

## Auto config

This configuration loads all sail models as they are. Just place  in `config\adminpanel.js`

```javascript
 const fs = require("fs");
 let modelPath = __dirname + "/../api/models";
 let models = {};
 fs.readdir(modelPath, function (err, files) {
   files.forEach(function (file) {
     let modelName = file.split(".")[0];
     models[modelName] = {
       title: modelName,
       model: modelName,
     };
   });
 });
 
 module.exports.adminpanel = { models: models } ;
```


## Limitations

+ For now admin panel do not fully support waterline associations. So some fields might be ignored ! It's planned.
+ No file upload functionality. Due to the nature of `skipper` I removed file upload functionality. **Not tested with latest one**
+ No custom actions support. For now you couldn't add custom actions and pages into admin panel.
+ No template engine support except of `jade`. I primary working with this template engine and didn't create a another templates
+ No custom assets support. You couldn't edit css/js for admin panel for now.

## Configuration schema

```javascript
{
    models: {
        [key:string]: {
            title: string
            model: string // Model name
            hide: boolean // Hide model in left navbar
            fields: {
                [key: string]: {
                    title: string
                    type: FieldsTypes // all fields types are below this config
                    tooltip: string // Field description
                    // Options for widgets like 'Navigation', 'Schedule' and 'FileUploader'. For more
                    // information open Navigation.md or Schedule.md
                    options: NavigationOptionsField | ScheduleOptionsField | FileUploaderOptionsField
                    displayModifier: Function // Function that makes data modification on list view
                }[] | boolean | string
            }
            list: { // List display configuration
                fields: {
                    [key: string]: {
                        title: string
                        type: FieldsTypes // all fields types are below this config
                        tooltip: string // Field description
                        // Options for widgets like 'Navigation', 'Schedule' and 'FileUploader'. For more
                        // information open Navigation.md or Schedule.md
                        options: NavigationOptionsField | ScheduleOptionsField | FileUploaderOptionsField
                        displayModifier: Function // Function that makes data modification on list view
                    }[] | boolean | string
                }
                actions: { // Actions configuration that will be displayed
                    global: {
                        id: string
                        title: string
                        link: string
                        icon: string
                        // Only for view, controller still uses his own access rights token
                        accessRightsToken: string
                    }[]
                    inline: {
                        id: string
                        title: string
                        link: string
                        icon: string
                        // Only for view, controller still uses his own access rights token
                        accessRightsToken: string
                    }[]
                }
            } | boolean
            // Configuration for 'create model' action or disabling/enabling it
            add: {
                fields: {
                    [key: string]: {
                        title: string
                        type: FieldsTypes // all fields types are below this config
                        tooltip: string // Field description
                        // Options for widgets like 'Navigation', 'Schedule' and 'FileUploader'. For more
                        // information open Navigation.md or Schedule.md
                        options: NavigationOptionsField | ScheduleOptionsField | FileUploaderOptionsField
                        displayModifier: Function // Function that makes data modification on list view
                    }[] | boolean | string
                }
                modelModifier: Function // callback for data modification before saving record
                controller: string // path to custom controller
            } | boolean
            // Configuration for 'update model' action or disabling/enabling it
            edit: {
                fields: {
                    [key: string]: {
                        title: string
                        type: FieldsTypes // all fields types are below this config
                        tooltip: string // Field description
                        // Options for widgets like 'Navigation', 'Schedule' and 'FileUploader'. For more
                        // information open Navigation.md or Schedule.md
                        options: NavigationOptionsField | ScheduleOptionsField | FileUploaderOptionsField
                        displayModifier: Function // Function that makes data modification on list view
                    }[] | boolean | string
                }
                modelModifier: Function // callback for data modification before saving record
                controller: string // // path to custom controller
            } | boolean
            remove: boolean // Disabling/enabling 'delete model' action
            view: boolean // Disabling/enabling 'read model' action
            tools: { // Model actions displayed in left navbar for specific model
                id: string
                title: string
                link: string
                icon: string
                // Only for view, controller still uses his own access rights token
                accessRightsToken: string
            }[]
            icon: string // Model icon
            identifierField: string // Force set primary key
        }[]
    }
    sections: { // For custom adminpanel sections, displays inside header
        id: string
        title: string
        link: string
        icon: string
        // Only for view, controller still uses his own access rights token
        accessRightsToken: string
    }[]
    routePrefix: string // Route prefix for adminpanel, admin by default
    pathToViews: string // Relative path from project root to views folder
    identifierField: string // Force set primary key
    brand: {
        link: boolean | string | {
            id: string
            title: string
            link: string
            icon: string
            // Only for view, controller still uses his own access rights token
            accessRightsToken: string
        }
    }
    navbar: { // Left-side navigation bar
        additionalLinks: { // will be created at the bottom of the sidenav panel
            id: string
            title: string
            link: string
            icon: string
            // Only for view, controller still uses his own access rights token
            accessRightsToken: string
        }[]
    }
    // Policies that will be executed before going to every page
    policies: string | string[] | Function | Function[]
    styles: string[] // custom adminpanel styles
    script: { // custom adminpanel scripts
        header: string[]
        footer: string[]
    }
    welcome: { // Text for welcome page
        title: string
        text: string
    }
    translation: { // Text translation using sails built-in internationalization
        locales: string[] // Locales list
        path: string // Relative path from project root to translations folder
        defaultLocale: string // Default locale
    }
    // default administrator login credentials, will be used if no admin profiles found
    administrator: {
        login: string
        password: string
    }
    // forms
    forms: {
        path: string
        data: object
        get: Function
        set: Function
    }
    // Enable/disable displaying createdAt and updatedAt fields in `edit` and `add` sections
    showORMtime: boolean
    package: any // Adminpanel package.json config
    timezones: { // Available timezones list
        id: string
        name: string
    }[]
    showVersion: boolean // Show adminpanel version on the bottom of navbar
}
```

### FieldsTypes

string, password, date, datetime, time, integer, number, float, color, email, month, week,
range, boolean, binary, text, longtext, mediumtext, ckeditor, wysiwyg, texteditor, word,
jsoneditor, json, array, object, ace, html, xml, aceeditor, image, images, file, files, table
menu, navigation, schedule, worktime, association, "association-many", select, select-pure
