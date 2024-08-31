
<p align="center">
  <img alt="Redox" width="346" src="assets/identy/logo.svg">
</p>

# sails-adminpanel
<span class="badge-npmversion"><a href="https://npmjs.org/package/sails-adminpanel" title="View this project on NPM"><img src="https://img.shields.io/npm/v/sails-adminpanel.svg" alt="NPM version" /></a></span>

**Only for use sails  > v1.5**

## SailsJS Discord community
**Community Link:** [Join SailsJS Discord Community](http://discord-sails.42.pub)
Feel free to use this link to connect with the community and engage in discussions or ask any questions you may have.


## About

The admin panel offers automatic generation capabilities, ensuring ease of use, and includes features such as internationalization, user and group access rights, policy enforcement, and a modern user interface. In the near future, installation steps will be provided for a smoother setup experience.

Key Features and Components:

- **Access Rights:** Manage user and group access rights efficiently.
- **GeoJsonWidget:** A widget designed for handling GeoJSON data.
- **Policies:** Enforce policies to control and restrict actions within the admin panel.
- **AceEditorWidget:** Incorporate the Ace code editor widget for code editing functionalities.
- **HandsontableWidget:** Utilize the Handsontable widget for creating interactive data tables.
- **CKeditorWidget:** A widget featuring the CKeditor for rich text editing capabilities.
- **Links:** Manage and organize links within the admin panel.
- **ScheduleWidget:** Incorporate a widget for scheduling and time-related functionalities.
- **Configuration:** Configure various settings and options for the admin panel.
- **Sections:** Organize and manage different sections of the admin panel.
- **Dashboard:** View and customize the admin panel dashboard for a personalized experience.
- **ModifierCallbacks:** Implement callbacks for modifying data and behavior.
- **Styles:** Customize the appearance and styling of the admin panel.
- **FileUploaderWidget:** Utilize a widget for convenient file uploading functionalities.
- **Navbar:** Manage the navigation bar for easy access to different sections.
- **Translations:** Implement internationalization features for multiple language support.
- **Forms:** Create and manage forms for data input and manipulation.
- **NavigationWidget:** Utilize a widget to enhance navigation capabilities.
- **Widget:** General reference to customizable and extensible components.
- **Installer:** Product ready. Create an installer as a wizard

This comprehensive set of features and components makes the admin panel a powerful tool for managing and controlling various aspects of your application with a focus on simplicity and a modern user interface.

## Installation

To install this hook, you will need to run:

```bash
npm install sails-adminpanel
```

### i18n
> Currently, we have to patch sails framework, so you install our patches for using all functionality. Without these patches, i18n will not work. [Read how to install the patch](https://www.npmjs.com/package/muddy-water)

### Configuration
Then you will need to create a config file for the admin panel generator into `config/adminpanel.js`
For use Typescript look below

This is an example of this file:

```javascript
'use strict';

module.exports.adminpanel = {
    models: {

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
```

And your admin panel will be accessible under: `http://127.0.0.1:port/admin`
## Documentation & Types

For comprehensive information on configuration and usage, it is highly recommended to refer to the [docs](https://github.com/sails-adminpanel/sails-adminpanel/tree/master/docs) folder within the project repository. The documentation provides detailed insights into various aspects of the admin panel, including configuration options and usage guidelines.

When working with TypeScript in the project, it is advisable to explore the type definitions located in the `/interfaces/adminpanelConfig.d.ts` file. This TypeScript definition file outlines the types and structures associated with the admin panel configuration. It serves as a valuable resource for understanding the available options and ensuring type safety when configuring the admin panel.

For projects utilizing TypeScript, consider the following example:

```typescript
import { ModelConfig, AdminpanelConfig } from "sails-adminpanel/interfaces/adminpanelConfig";

let models: { [key: string]: ModelConfig } = {
  // Define your model configurations here
};

var config: AdminpanelConfig = {
  //auth: true,
  dashboard: {
    autoloadWidgetsPath: 'api/dashboardWidgets',
    defaultWidgets: ['reload_website']
  },
  brand: {
    link: {
      title: 'SailsJS adminpanel',
      id: "brand_link",
      link: "/admin"
    }
  }
};

module.exports.adminpanel = config;
```

This TypeScript example demonstrates how to structure model configurations and the overall admin panel configuration. Utilizing TypeScript enhances code clarity, provides autocompletion support, and helps prevent potential configuration errors.


## UI Reference

The UI of the project is designed with the Tailwind CSS framework, providing a modern and responsive user interface.

### Gulp

- **Main Gulp File:** `gulpfile.js`

### Gulp Commands

- `gulp` - Executes in development mode.
- `gulp prod` - Executes in production mode.

### CKeditor5

- **Custom Build File:** `assets/src/scripts/ckeditor5/app.js`
- **Gulp Task:** `gulp ckeditorBuild`

The CKeditor5 section indicates the custom build file location for CKeditor5, which can be found at `assets/src/scripts/ckeditor5/app.js`. Additionally, there is a Gulp task named `gulp ckeditorBuild` associated with building CKeditor5.

These details provide information on the project's build process, specifically related to Gulp tasks and CKeditor5 customization.

## TODO:
1. Check csrf for fileUpload
2. Docs finish
3. Add disabled fields to all widgets


## Problems
for fileUploader (readmore in TODO)

```javascript
csrf: false
```


## License

MIT
