# Sections navigation

Is a menu in the bottom of header screen side, for fast switching between sections


```javascript
module.exports.adminpanel = {
    sections: [
        {
            id: 'users',
            title: 'Users',
            link: '/users',
            icon: 'users',
            accessRightsToken: 'userToken'
        },
        {
            id: 'content',
            title: 'Content items'
        }
    ]
```

