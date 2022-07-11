# Forms

You can add forms when you have no need to create a Model. For example, for
single block on page that will not be repeated. Or like a link with model settings.

You can add forms directly to adminpanel configuration or put them in files with
`.json` extension which should be named as form slug. Put your forms in your
directory and write down path to it in `path` field.

```javascript
module.exports.adminpanel = {
    forms: {
        path: 'forms',
        data: {
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
- data - object with forms which are named by unique slug

You can use forms by adding adminpanel special links like `tools`, `additionaLinks`
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
