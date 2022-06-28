let forms = {
    example: {
        label: {
            title: "Label",
            type: "string",
            value: "label1",
            required: true,
            tooltip: 'tooltip for label',
            description: "some description"
        }
    }
}

module.exports.adminpanel = {
    // auth: true
    translation: {
        locales: ['en', 'ru', 'de', 'ua'],
        path: 'wont be used',
        defaultLocale: 'en'
    },
    forms: {
        loadFromFiles: true,
        path: '../datamocks/forms',
        data: forms
    }
}
