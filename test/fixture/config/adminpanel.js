let models = {
	test: {
		title: 'test Form example from file',
		model: 'test',
		tools: [
			{
				link: '/test/404',
				title: 'Some new action',
				icon: 'cat',
			},
			{
				link: '#',
				title: 'Form example',
				icon: 'beer',
				accessRightsToken: 'read-example-form'
			},
			{
				link: '#',
				title: 'Form example from file Form example from file',
				icon: 'beer',
				accessRightsToken: 'read-exampleFromFile-form'
			}
		],
		"list": {
			"fields": {
				"title": { "title": "Title", "tooltip": "Main title of the item" },
				"number": { "title": "Number", "type": "number" },
				"color": { "title": "Color", "type": "color" }
			}
		},
		"add": {
			"fields": {
				"title": false,
				"guardedField": {
					"title": "Restricted Field",
					"groupsAccessRights": ["admin", "editor"],
					"type": "string"
				}
			}
		},
		"edit": {
			"fields": {
				"title": { "title": "Title", "type": "string", "required": true },
				"color": { "title": "Color", "type": "color" },
				"guardedField": {
					"title": "Restricted Field",
					"groupsAccessRights": ["admin", "manager"]
				}
			}
		},
		"remove": true,
		"view": true,
		"fields": {
			"title": { "title": "Title", "tooltip": "Item Description", "required": true },
			"number": { "title": "Number", "type": "number" },
			"guardedField": {
				"title": "Guarded Field",
				"groupsAccessRights": ["admin", "editor"],
				"type": "string"
			},
			"selfAssociation": {
				"title": "Self Association",
				"type": "association",
				"model": "test"
			}
		},
		"icon": "flask"
	},
	category: {
		title: 'Category',
		model: 'category',
		icon: 'cat'
	},
	page: {
		title: 'Page',
		model: 'page',
		fields: {
			createdAt: false,
			updatedAt: false,
			slug: {
				title: 'Slug',
				type: 'string',
				// @ts-ignore
				required: true
			},
			title: {
				title: 'Title',
				type: 'string',
				// @ts-ignore
				required: true
			},
			text: {
				title: 'Text',
				type: 'wysiwyg',
				options: {
					ckeditor5: true,
				},
			},
			about: {
				type: 'text'
			},
			gallery: {
				type: 'images',
				options: {
					accepted: [
						'jpeg',
						'jpg',
						'webp'
					],
					filesize: 2
				},
			},
		},
		icon: 'wrench'
	}
};

module.exports.adminpanel = {
	// auth: true,
	registration: {
		enable: true,
		defaultUserGroup: "default user group",
	},
	translation: {
		locales: ['en', 'ru', 'de', 'ua'],
		path: 'wont be used',
		defaultLocale: 'en'
	},
	forms: {
		path: '../datamocks/forms',
		data: {
			example: {
				label: {
					title: 'Label',
					type: 'string',
					value: 'label1',
					required: true,
					tooltip: 'tooltip for label',
					description: 'some description'
				}
			}
		}
	},
	navigation: {
		items: [
			{
				title: 'Page',
				model: "page",
				urlPath: '/page/${data.record.slug}'
			},
			{
				title: 'Category',
				model: "category",
				urlPath: '/longlinkkkkk/category/${data.record.slug}'
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
	},
	models: models
};





