# Handsontable

Before using this widget check out [Official documentation](https://handsontable.com/docs/)

Widget Handsontable allows you to create tables that you can easily customize
in adminpanel. To use this widget just add `type:"table"` in target field.
In options field you can add all handsontable options except `data` and `afterChange`
function, they are already set.

```javascript
module.exports.adminpanel = {
    instances: {
        pages: {
            title: 'Pages', 
            model: 'Page',

            datatable: {
                title: "Spreadsheet",
                type: "table",
                options: {
                    rowHeaders: true,
                    colHeaders: true,
                    height: 'auto',
                    contextMenu: true,
                    manualRowMove: true,
                    licenseKey: 'non-commercial-and-evaluation', // for non-commercial use only
                }
            },
        }
    }
}
```
