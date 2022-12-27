# WYSIWYG widge

The WYSIWYG widget uses CKEditor. By default, the 4th version of the editor is used. To enable the 5th version, use the following settings:

```javascript
module.exports.adminpanel = {
    fields: {
			title: "Title",
			ckeditor5: {
				type: "wysiwyg",
				title: "CKedito 5",
				options: { // required for CKeditor5
					ckeditor5: boolean, // CKeditor5 enabled/disabled
					removePlugins: [],
					toolbar: { 
						items: []
					},
					image: {
						toolbar: []
					},
					table: {
						contentToolbar: [}
					}
				}
			}
	}
}
```
## Remove Plugins

If you want to disable some plugins, list them separated by commas in array. Example:

```javascript
removePlugins: [ 
	'Table',
	'TableCaption',
	'TableCellProperties',
	'TableColumnResize',
	'TableProperties',
	'TableToolbar',
    ]
```
In this example, disable the tables plugin
Full list of included plugins:
```javascript
builtinPlugins = [
	Alignment,
	Autoformat,
	AutoLink,
	BlockQuote,
	Bold,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	GeneralHtmlSupport,
	Heading,
	HorizontalLine,
	Image,
	ImageCaption,
	ImageResize,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	SourceEditing,
	SpecialCharacters,
	SpecialCharactersEssentials,
	Strikethrough,
	Subscript,
	Superscript,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextTransformation,
	Underline,
	WordCount,
	HtmlEmbed
]
```
## Toolbar

In the builds that contain toolbars an optimal default configuration is defined for it. You may need a different toolbar arrangement, though, and this can be achieved through configuration. Toolbar configuration is a strict UI-related setting. Removing a toolbar item does not remove the feature from the editor internals. If your goal with the toolbar configuration is to remove features, the right solution is to also remove their respective plugins. Check removing features for more information. More info https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html
By default:
```javascript
toolbar: { 
    items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'undo',
        'redo',
        'htmlEmbed',
        'mediaEmbed',
        'alignment',
        'fontBackgroundColor',
        'fontColor',
        'fontFamily',
        'fontSize',
        'horizontalLine',
        'sourceEditing',
        'specialCharacters',
        'strikethrough',
        'subscript',
        'superscript',
        'underline'
    ]
},
```
## Image
More info https://ckeditor.com/docs/ckeditor5/latest/features/images/images-styles.html#configuring-the-styles
By default:
```javascript
image: {
    toolbar: [
        'imageTextAlternative',
        'toggleImageCaption',
        'imageStyle:alignLeft',
        'imageStyle:alignRight',
        'imageStyle:alignBlockLeft',
        'imageStyle:alignCenter',
        'imageStyle:alignBlockRight',
        'linkImage'
    ]
},
```
## Table
More info https://ckeditor.com/docs/ckeditor5/latest/features/table.html#toolbars
By default:
```javascript
table: {
    contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableCellProperties',
        'tableProperties'
    ]
}
```
## Language
Locale will be set from adminpanel.
```javascript
module.exports.adminpanel = {
    translation: {
        locales: ['en', 'ru', 'de', 'ua'],
        path: 'config/locales/adminpanel',
        defaultLocale: 'en'
    },
}
```