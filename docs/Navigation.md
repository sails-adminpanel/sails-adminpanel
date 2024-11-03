# Navigation

Navigation should be added via **config/adminpanel.{js,ts}** in your sails js project


Navigation is a specialized catalog type that we have pre-configured for your convenience. If you choose not to use it, the corresponding model will not be loaded. However, you can explore how the catalog is structured to either rewrite the navigation or create your own custom navigation system.


```typescript
interface NavigationItemTypeConfig {
	/**
	 * A model that will be available for editing in navigation
	 */
	model: string
	title: string
	/**
	 * Specify how the link to your page will be generated 
	 * `/page/${data.record.slug}`
	 * 
	 */
	urlPath: string | ((v: any) => string)
}


interface NavigationConfig {
	model?: string
	sections: string[]
	groupField: { name: string, required: boolean }[]
	items: NavigationItemTypeConfig[],
	movingGroupsRootOnly: boolean
}
``````

## NavigationItemTypeConfig

This interface describes the configuration for an individual item in the navigation.

- model: A string representing the model associated with this navigation item. [*](#notes)
- title: A string representing the title of this navigation item.
- urlPath: A string or a function that generates the URL path for this navigation item. It can either be a static string or a function that takes an argument and returns a string. Note: **'/page/${data.record.slug}'**, where slug is the attribute for the slug shown by you in the Page model.

> ⚠️ You must understand that `urlPath` will only be a link, you must register the controllers yourself

## NavigationConfig

This interface describes the overall configuration for the navigation.

- model: An optional string representing the model associated with this navigation.
- sections: An array of strings representing the sections in the navigation.
- groupField: An array of objects describing the fields that can be used to group items in the navigation. Each object has a name property representing the field name and a required property indicating whether the field is required.
- items: An array of NavigationItemTypeConfig objects representing the individual items in the navigation.
- movingGroupsRootOnly: A boolean indicating whether groups in the navigation can only be moved to the root level.

## Example

```javascript
navigation: {
	// model: "Navigation",
	items: [
		{
			title: 'Page',
			model: "page",
			urlPath: '/page/${data.record.slug}'
		},
		{
			title: 'Category',
			model: "category",
			urlPath: '/category/${data.record.slug}'
		}
	],
		// Links in the admin panel leading to different navigation data (for example: header, footer) should end the same way as you specify in the array
		// /admin/catalog/navigation/footer
		// /admin/catalog/navigation/header
		sections: ['header', 'footer'],
		groupField: [
		{
			name: 'link',
			required: false
		},
		{
			name: "Test Field",
			required: false
		}
	],
		movingGroupsRootOnly: true
}
``````

## Notes

The built-in model is used by default. If you want to use your own model, then you should specify it in the **model** field. See [NavigationAP](../models/NavigationAP.ts)
