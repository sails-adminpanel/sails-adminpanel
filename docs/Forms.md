# Forms

You can add forms when you have no need to create an instance. For example, for
single block on page that will not be repeated. Or like a link with model settings.

You can add forms directly to adminpanel configuration or put them in files with
`.json` extension which should be named as form slug. Put your forms in 
`.tmp/forms` directory or write down your custom path in `path` field.
Notice that if `.tmp/forms` folder exists, forms from custom path will not be used.
After change forms will be saved in `.tmp/forms`.

```javascript
module.exports.adminpanel = {
    generator: {
        path: 'forms',
        forms: {
            formSlug: {
                field1: {
                    title: "Field1",
                    type: "string",
                    value: "Some string",
                    required: true,
                    tooltip: 'tooltip for field1',
                    description: "some description"
                }
            }
        }
    },
}
```

- path - relative path to your forms from project directory
- forms - object with forms which are named by unique slug

You can use forms by adding adiminpanel special links like `tools`, `additionaLinks`
in navbar, `global` or `inline` actions. To do that read [Links](Links.md)

## How to create a form

Forms is `.json` files that contains fields with `BaseFieldConfig` options.
`title` and `type` are required.

```json
{
  "label": {
    "title": "Label",
    "type": "string",
    "value": "From example from file",
    "required": true,
    "tooltip": "tooltip for label",
    "description": "some description"
  },
  "teaser": {
    "title": "Тизер",
    "type": "text",
    "required": true,
    "tooltip": "tooltip for teaser",
    "description": "some description",
    "value": ""
  }
}
```
