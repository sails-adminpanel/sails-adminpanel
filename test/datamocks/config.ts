import {AdminpanelConfig, FieldsTypes, InstanceConfig} from "../../interfaces/adminpanelConfig";

/**
 * This configuration loads all sail models as they are
 */

function randomFaIcon(params) {
    let faIcons = [
        "align-center",
        "american-sign-language-interpreting",
        "angry",
        "atlas",
        "address-book",
        "address-card",
        "broom",
        "brush",
        "cloud",    "shopping-cart",
        "search",
        "share",
        "shower",
    ];

    return faIcons[Math.floor(Math.random() * faIcons.length)];
}

let instances: {[key: string]: InstanceConfig} = {
    navigation: {
        title: "Навигация",
        model: "navigation",
        fields: {
            menu: {
                title: "Редактор меню",
                type: FieldsTypes.menu,
                options: {
                    maxNestedItems: 2,
                    visibleElement: 'visible', // can be 'visible', 'hidden', false
                    titleProperties: "title",
                    propertyList: {
                        'title': {
                            'type': 'string',
                            'title': 'Title',
                            'description': "this is the title",
                            'required': 'true'
                        },
                        'visible': {
                            'type': 'boolean',
                            'title': 'Visible',
                            'description': "element visibility",
                            'required': 'true'
                        },
                        'link': {
                            'type': 'string',
                            'title': 'Link',
                            'description': "this is the link"
                        }
                    },
                    displacementControl: true
                }
            },
            createdAt: false,
            updatedAt: false
        }
    },
    examplefromfigma: {
        title: "Пример из Figma",
        model: "ExampleTestDataModel",
        actions: [
            {
                id: "action1",
                link: "/",
                title: "Some new action",
                icon: "ok",
            },
        ],
        fields: {
            label: "Заголовок",
            teaser: {
                title: "Тизер",
                type: FieldsTypes.text,
                tooltip: "Just any description here"
            },

            description: {
                title: "Описание",
                type: FieldsTypes.wysiwyg,
            },

            date: {
                title: "Дата",
                type: FieldsTypes.date,
            },

            datetime: {
                title: "Дата и время",
                type: FieldsTypes.datetime,
            },



            time: {
                title: "время",
                type: FieldsTypes.time,
            },

            number: {
                title: "Число",
                type: FieldsTypes.number,
            },
            color: {
                title: "цвет",
                type: FieldsTypes.color,
            },
            email: {
                type: FieldsTypes.email,
            },
            month: {
                type: FieldsTypes.month,
            },
            range: {
                type: FieldsTypes.range,
            },
            week: {
                type: FieldsTypes.week,
            },



            ace: {
                title: "HTML",
                type: FieldsTypes.ace,
            },

            fileUploader: {
                title: "FileUploader",
                type: FieldsTypes.file,
            },

            filesUploader: {
                title: "FilesUploader",
                type: FieldsTypes.files,
            },

            galleryUploader: {
                title: "GalleryUploader",
                type: FieldsTypes.images,
            },

            imageUploader: {
                title: "ImageUploader",
                type: FieldsTypes.image,
            },
            schedule: {
                title: "Редактор распорядка",
                type: FieldsTypes.worktime,
                options: {
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
                        hint: {
                            type: "string",
                            title: "Hint",
                            description: "this is the hint",
                        },
                        link: {
                            type: "string",
                            title: "Link",
                            description: "this is the link",
                        },
                        age: {
                            type: "number",
                            title: "Age",
                            description: "this is the age",
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
            fields: {
                json: {
                    title: "Содержимое",
                    type: FieldsTypes.json,
                },
                gallery: {
                    type: FieldsTypes.images,
                    options: {
                        filesize: 10,
                        accepted: ["png", "jpeg", "jpg", "gif"],
                        small: 200,
                        large: 700,
                    },
                },
            },
        },
        edit: {
            fields: {
                json: {
                    title: "JSON",
                    type: FieldsTypes.json,
                },
                gallery: {
                    type: FieldsTypes.images,
                    options: {
                        filesize: 10,
                        accepted: ["png", "jpeg", "jpg", "gif"],
                        small: 200,
                        large: 700,
                    },
                },
            },
        },
    },
};

setTimeout(() => {
    sails.after(["hook:orm:loaded"], () => {
        Object.keys(sails.models).forEach((modelname) => {
            let modelName = sails.models[modelname].globalId;
            instances[modelName] = {
                title: modelName + " dev",
                model: modelName,
                fields: {
                    createdAt: false,
                    updatedAt: false,
                },
            };
        });
    });
}, 3000);

let adminpanel: AdminpanelConfig = {
    // auth: true,
    // dashboard: true,
    sections: [
        {
            id: "section1",
            title: 'Website',
            link: 'https://webresto.org'
        },
    ],
    welcome: {
        // title: "hello",
        // text: "world"
    },
    instances: instances
};
