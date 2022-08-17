# Navigation widget

Navigation editor is a widget, that allows you to create and edit menu lists.
You can move elements wherever you want using sortable or arrow buttons,
create nested levels of them by inserting one element into another with
sortable-lists or parent selector, which is inside pop-up.

```javascript
navigation: {
    title: "Навигация",
        model: "navigation",
        fields: {
        menu: {
                title: "Редактор меню", 
                type: "menu",
                options: {
                    maxNestedItems: number,
                    displacementControl: boolean,
                    disableAddingProperty: boolean,
                    disableDeletingProperty: boolean,
                    propertyList: {},
                    visibleElement: string or false,
                    titleProperties: string
                }
        }
        },
        createdAt: false,
            updatedAt: false
    }
```

Navigation editor has opts field where you can add next properties:
+ maxNestedLevel
+ displacementControl
+ propertyList
+ visibleElement
+ titleProperties
+ disableAddingProperty
+ disableDeletingProperty

Using propertyList you can add list of properties that can be chosen.
It can contain 5 types of properties:
- string
- boolean
- number
- text
- select

`select` type will be displayed as [select-pure widget](https://www.cssscript.com/multi-select-autocomplete-selectpure/).
This type should contain `options` field which is an array of objects that represents select-pure options:
`{label: "label", value: "value"}`. Also you can use custom function for create
needed array.

For example:
```javascript
propertyList: {
    title: {
            type: "string", 
            title: "Title",
            description: "this is the title",
            required: "true",
    },
    checkmark: {
            type: "boolean",
            title: "Checkmark",
            description: "this is the checkmark",
    },
    age: {
            type: "number",
            title: "Age",
            description: "this is the age",
    },
    hint: {
            type: 'text',
            title: 'Hint',
            description: "element hint",
    },
    link: {
            type: 'select',
            title: 'Link',
            description: "this is the link",
            options: async function () {
                let pages = await Page.find({});
                pages = pages.map(function(item, index) {return {label: item.label, value: item.slug}})
                return pages;
            }
    }
}
```

Using maxNestedItems you can choose max number of nested elements.

For example:
```javascript
maxNestedItems: 4
```

Using displacementControl you can forbid using sortable 
if element has inserted elements.

For example:
```javascript
displacementControl: true
```

Using disableAddingProperty you can forbid adding properties in pop-up

For example:
```javascript
disableAddingProperty: true
```

Using disableDeletingProperty you can forbid deleting properties in pop-up

For example:
```javascript
disableDeletingProperty: true
```

Using visibleElement you can set default value of visible
property. ```'visible'``` means that all elements will be
visible by default, ```'hidden``` means that they will be
hidden, ```false``` means that visible property is off.

For example:
```javascript
visibleProperty: false
```
or
```javascript
visibleProperty: 'hidden'
```

Using titleProperties you can set the property, that would
be title of the element. It would better be a word of a
collocation.

For example:
```javascript
titleProperties: 'label'
```
