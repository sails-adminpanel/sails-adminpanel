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
    fields: {
      title: {
        title: 'Title',
        tooltip: 'Item Description'
      },
      title_2: {
        title: 'Textarea',
        type: 'text'
      },
      test_ck5_1: {
        type: 'wysiwyg',
        tooltip: 'In the builds that contain toolbars an optimal default configuration is defined for it. You may need a different toolbar arrangement, though, and this can be achieved through configuration. Toolbar configuration is a strict UI-related setting. Removing a toolbar item does not remove the feature from the editor internals. If your goal with the toolbar configuration is to remove features, the right solution is to also remove their respective plugins. Check removing features for more information.',
        title: 'New Editor CKeditor 5',
        options: {
          ckeditor5: true, // CKeditor5 enabled/disabled
          removePlugins: [ // if you want to disable some plugins, list them separated by commas in this array
            'Style'
          ],
          // In the builds that contain toolbars an optimal default configuration is defined for it. You may need a different toolbar arrangement, though, and this can be achieved through configuration. Toolbar configuration is a strict UI-related setting. Removing a toolbar item does not remove the feature from the editor internals. If your goal with the toolbar configuration is to remove features, the right solution is to also remove their respective plugins. Check removing features for more information. More info https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html
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
              'removeFormat',
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
          // More info https://ckeditor.com/docs/ckeditor5/latest/features/images/images-styles.html#configuring-the-styles
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
          // More info https://ckeditor.com/docs/ckeditor5/latest/features/table.html#toolbars
          table: {
            contentToolbar: [
              'tableColumn',
              'tableRow',
              'mergeTableCells',
              'tableCellProperties',
              'tableProperties'
            ]
          }
        }
      },
      sort: {
        type: 'boolean',
        title: 'Boolean'
      },
      sort_test: {
        type: 'boolean',
        title: 'Boolean'
      },
      image: {
        type: 'image',
        title: ' Image',
        options: {
          accepted: [
            'jpeg',
            'jpg',
            'webp'
          ],
          filesize: 2
        },
      },
      gallery: {
        type: 'images',
        title: 'Images',
        options: {
          accepted: [
            'jpeg',
            'jpg',
            'webp'
          ],
          filesize: 2
        },
      },
      file: {
        type: 'files',
        options: {
          filesize: 2,
          accepted: ['pdf', 'docx']
        }
      },
      range: {
        type: 'range',
        options: {
          min: -5,
          max: 360
        }
      },
      json: {
        type: 'jsoneditor'
      },
      ace: {
        type: 'ace'
      },
      datatable: {
        title: 'Price',
        type: 'table',
        options: {
          dataSchema: {name: null, footage: null, price: null},
          colHeaders: ['One', 'Two', 'Three'],
          rowHeaders: true,
          columns: [
            {data: 'name'},
            {data: 'footage'},
            {data: 'price'}
          ],
          height: 'auto',
          width: 'auto',
          manualColumnResize: true,
          contextMenu: true,
          language: 'en_EN',
          licenseKey: 'non-commercial-and-evaluation', // for non-commercial use only
        },
      },
      geojson: {
        type: 'geo-polygon',
      },
      examples: {
        displayModifier: function (data) {
          return data.title;
        }
      },
      select: {
        isIn: ['one', 'two', 'three']
      },
      date: {
        title: 'Date',
        type: 'date',
      },
      datetime: {
        title: 'Date and time',
        type: 'datetime',
      },
      time: {
        title: 'time',
        type: 'time',
      },
      number: {
        title: 'number',
        type: 'number',
      },
      color: {
        title: 'color',
        type: 'color',
      },
      week: {
        type: 'week',
      },
      schedule: {
        title: 'Schedule Editor',
        type: 'worktime',
        options: {
          propertyList: {
            title: {
              type: 'string',
              title: 'Title',
              description: 'this is the title',
              required: 'true',
            },
            checkmark: {
              type: 'boolean',
              title: 'Checkmark',
              description: 'this is the checkmark',
            },
            hint: {
              type: 'string',
              title: 'Hint',
              description: 'this is the hint',
            },
            link: {
              type: 'string',
              title: 'Link',
              description: 'this is the link',
            },
            age: {
              type: 'number',
              title: 'Age',
              description: 'this is the age',
            },
          },
          permutations: {
            time: true,
            date: true,
            break: true,
            options: true,
          }
        }
      },
      createdAt: false,
      updatedAt: false,
    },
    add: {
      fields: {},
    },
    edit: {
      fields: {},
    },
    list: {
      fields: {},
      actions: {
        global: [
          {
            link: 'https://www.google.com.ua/',
            title: 'Google',
            icon: 'external-link-square-alt'
          }
        ],
        inline: [
          {
            link: 'https://www.google.com.ua/',
            title: 'Google',
            icon: 'external-link-square-alt'
          }, {
            link: 'https://www.google.com.ua/',
            title: 'Google2',
            icon: 'external-link-square-alt'
          }, {
            link: 'https://www.google.com.ua/',
            title: 'Google3',
            icon: 'external-link-square-alt'
          }, {
            link: 'https://www.google.com.ua/',
            title: 'Google4',
            icon: 'external-link-square-alt'
          },
        ]
      }
    },
    icon: 'flask'
  }
};

module.exports.adminpanel = {
  // auth: true
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
  models: models
};





