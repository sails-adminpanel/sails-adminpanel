"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../interfaces/types");
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
        "cloud", "shopping-cart",
        "search",
        "share",
        "shower",
    ];
    return faIcons[Math.floor(Math.random() * faIcons.length)];
}
let instances = {
    navigation: {
        title: "Навигация",
        model: "navigation",
        fields: {
            menu: {
                title: "Редактор меню",
                type: types_1.FieldsTypes.menu,
                options: {
                    maxNestedItems: 2,
                    visibleElement: 'visible',
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
                link: "/",
                title: "Some new action",
                icon: "ok",
            },
        ],
        fields: {
            label: "Заголовок",
            teaser: {
                title: "Тизер",
                type: types_1.FieldsTypes.text,
                tooltip: "Just any description here"
            },
            description: {
                title: "Описание",
                type: types_1.FieldsTypes.wysiwyg,
            },
            date: {
                title: "Дата",
                type: types_1.FieldsTypes.date,
            },
            datetime: {
                title: "Дата и время",
                type: types_1.FieldsTypes.datetime,
            },
            time: {
                title: "время",
                type: types_1.FieldsTypes.time,
            },
            number: {
                title: "Число",
                type: types_1.FieldsTypes.number,
            },
            color: {
                title: "цвет",
                type: types_1.FieldsTypes.color,
            },
            email: {
                type: types_1.FieldsTypes.email,
            },
            month: {
                type: types_1.FieldsTypes.month,
            },
            range: {
                type: types_1.FieldsTypes.range,
            },
            week: {
                type: types_1.FieldsTypes.week,
            },
            ace: {
                title: "HTML",
                type: types_1.FieldsTypes.ace,
            },
            fileUploader: {
                title: "FileUploader",
                type: types_1.FieldsTypes.file,
            },
            filesUploader: {
                title: "FilesUploader",
                type: types_1.FieldsTypes.files,
            },
            galleryUploader: {
                title: "GalleryUploader",
                type: types_1.FieldsTypes.images,
            },
            imageUploader: {
                title: "ImageUploader",
                type: types_1.FieldsTypes.image,
            },
            schedule: {
                title: "Редактор распорядка",
                type: types_1.FieldsTypes.worktime,
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
                    type: types_1.FieldsTypes.json,
                },
                gallery: {
                    type: types_1.FieldsTypes.images,
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
                    type: types_1.FieldsTypes.json,
                },
                gallery: {
                    type: types_1.FieldsTypes.images,
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
                icon: randomFaIcon(),
                fields: {
                    createdAt: false,
                    updatedAt: false,
                },
            };
        });
    });
}, 3000);
let adminpanel = {
    // auth: true,
    // dashboard: true,
    sections: [
        {
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
