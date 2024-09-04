# Translations

You can add custom translations to adminpanel using translation setting.
Translations work separately for every user.

```javascript
module.exports.adminpanel = {
    translation: {
        locales: ['en', 'ru', 'de', 'ua'],
        path: 'config/locales/adminpanel',
        defaultLocale: 'en'
    },
}
```

- locales - list of locales
- path - relative path to your translations from project directory
- defaultLocale - default locale, locales[0] if not defined


