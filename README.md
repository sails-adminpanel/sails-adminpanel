# NodeJS AdminPanel
Autogeniration adminpanel |  internationalization | User & Group access rights | Policies | Modern UI

In nearest future: Customization dashboard | Custom widgets | Wizards

### ***sails-adminpanel readme for sails v1.x***

___sails v0.x is not supported___

TODO: 
1. Check csrf to fileUpload
2. Docs finish

for fileUploader

    csrf: false


# Installation

To install this hook you will need to run:

    npm install sails-adminpanel

> Currently, we have to patch sails framework, so you install our patches for using
all functionality. Without these patches i18n will not work. [Read how to install patch](https://www.npmjs.com/package/dark-sails)

Then you will need to create a config file for admin panel generator into `config/adminpanel.js`

This is example of this file:

    'use strict';

    module.exports.adminpanel = {
        entities: {

            pages: {

                title: 'Pages',
                model: 'Page',

                list: {
                    fields: {
                        id: 'ID',
                        name: 'Article name'
                    }
                },

                edit: {
                    fields: {
                        name: 'Article name',
                        content: {
                            type: 'wysiwyg',
                            title: 'Article body'
                        }
                    }
                }
            }
        }
    };


And your admin panel will be accessible under: `http://127.0.0.1:port/admin`

## Documentation

Take a look into [docs](https://github.com/sails-adminpanel/sails-adminpanel/tree/master/docs) folder. There are a lot of docs about configuration and usage.

## UI reference

We use VmWare Clarity framework as UI framework

Clarity docs https://vmware.github.io/clarity/documentation/v0.13/

for build styles - sass --watch clarity/src:assets/styles/

## License

MIT
 
