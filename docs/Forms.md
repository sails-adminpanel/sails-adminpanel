# Forms

You can add forms when you have no need to create an instance. For example, for
single block on page that will not be repeated.

You can add forms directly to adminpanel configuration or put them in files with
`.json` extension which should be named as form slug. Path to folder with this
forms you should write down in `path` field

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
