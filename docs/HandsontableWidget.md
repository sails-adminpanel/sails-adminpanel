# Handsontable

Before using this widget check out [Official documentation](https://handsontable.com/docs/)

Widget Handsontable allows you to create tables that you can easily customize
in adminpanel. To use this widget just add `type:"table"` in target field.
In options field you can add all handsontable options except `data`. In case of using `language` option just specify
language code, locale import will be done automatically. List of language codes you
can find [here](https://handsontable.com/docs/language/#list-of-available-languages).
If you don't use language option, locale will be set from adminpanel.

If you use dataSchema, avoid complicated structures like `{key: {nestedKey: nestedValue}}`,
for now works only `{key: value}` scheme.

```javascript
module.exports.adminpanel = {
    models: {
        pages: {
            title: 'Pages', 
            model: 'Page',
            fields: {
                datatable: {
                    title: "Spreadsheet",
                    type: "table",
                    options: {
                        rowHeaders: true,
                        colHeaders: true,
                        height: 'auto',
                        contextMenu: true,
                        manualRowMove: true,
                        language: 'pl-PL',
                        licenseKey: 'non-commercial-and-evaluation', // for non-commercial use only
                    }
                },
            }
        }
    }
}
```
