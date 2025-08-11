<p align="center">
  <img alt="Redox" width="346" src="assets/identy/logo.svg">
</p>

# sails-adminpanel
<span class="badge-npmversion"><a href="https://npmjs.org/package/sails-adminpanel" title="View this project on NPM"><img src="https://img.shields.io/npm/v/sails-adminpanel.svg" alt="NPM version" /></a></span>

---

🚚 🚚 🚚 **This project has moved!**  🚚 🚚 🚚
You can now find it at: [https://github.com/adminization/adminizer](https://github.com/adminization/adminizer)

> Please note: this is no longer a Sails hook — it has been refactored into a standalone middleware for any HTTP server.

If you're interested in maintaining this legacy repository, feel free to [create an issue](https://github.com/sails-adminpanel/sails-adminpanel/issues) and get in touch.

Thanks for your attention!
---

## About

> **Note:**
> This project is now fully integrated and wrapped by [adminizer](https://github.com/adminization/adminizer).
> All features and usage remain the same, but you no longer need to use previous wrappers or extra modules.
> Please use adminizer for future updates and improvements.

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
- **Catalog:** Create tree structure catalogs based on models or any other elements
- **NavigationWidget:** Utilize a widget to enhance navigation capabilities.
- **Widget:** General reference to customizable and extensible components.
- **Installer:** Product ready. Create an installer as a wizard

This comprehensive set of features and components makes the admin panel a powerful tool for managing and controlling various aspects of your application with a focus on simplicity and a modern user interface.

## Installation

To install this hook, you will need to run:

```bash
npm install sails-adminpanel
```

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

For comprehensive information on configuration and usage, it is highly recommended to refer to the [docs](https://github.com/adminization/adminizer/tree/main/docs) folder within the project repository. The documentation provides detailed insights into various aspects of the admin panel, including configuration options and usage guidelines.

When working with TypeScript in the project, it is advisable to explore the type definitions located in the `/interfaces/adminpanelConfig.d.ts` file. This TypeScript definition file outlines the types and structures associated with the admin panel configuration. It serves as a valuable resource for understanding the available options and ensuring type safety when configuring the admin panel.

> **TypeScript Typings:**
> If you need type definitions, you should import them directly from `adminizer`.
> The sails-adminpanel wrapper no longer contains any typings or type helpers.


For projects utilizing TypeScript, consider the following example:

```typescript
import { ModelConfig, AdminpanelConfig } from "adminizer";

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


## Problems

> **ESM Import Issue:**
> Please note that this project has a known issue with ESM imports.
> To ensure proper functionality, it is recommended to run the project using [tsx](https://github.com/esbuild-kit/tsx).


## Modules

To use the modules, you need to embed the code in **bootstrap** sails.
```javascript
sails.on('Adminpanel:afterHook:loaded', () => {
	const adminizer = sails.hooks.adminpanel.adminizer;

	adminizer.emitter.on('adminizer:loaded', () => {
		const policies = adminizer.config.policies;

		const moduleHandler = (req, res) => {
			if (req.adminizer.config.auth.enable && !req.user) {
				return res.redirect(`${req.adminizer.config.routePrefix}/model/userap/login`);
			}

			return req.Inertia.render({
				component: 'module',
				props: {
					moduleComponent: `/public/ComponentB.es.js`,
					message: 'Hello from Adminizer',
				}
			});
		};

		adminizer.app.all(
			`${adminizer.config.routePrefix}/module-test`,
			adminizer.policyManager.bindPolicies(policies, moduleHandler)
		);
	})
})
```

Through **props**, you must pass the public path to the assembled React component (see [docs](https://github.com/adminization/adminizer/tree/main/docs)). The remaining options in **props** may vary depending on the tasks. For example: `message: 'Hello from Adminizer'`

## License
MIT
