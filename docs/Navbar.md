# Navbar configuration

Navbar in admin panel could be configured using `navbar` key in main `adminpanel` configuration object.
You can add a new custom links for your custom pages or whatever else...

```javascript
module.exports.adminpanel = {
    // Here all navbar configuration could be set
    navbar: {
        additionalLinks: [
            {
                id: 1,
                title: 'Google',
                link: 'google.com',
                icon: 'google',
                accessRightsToken: 'redirect-google-link' // access token for redirection
            }
        ]
    }
};
```

## Brand configuration

To configure brand in admin panel you could use `brand` key.

It could be set in several ways:

+ `boolean` - will turn on/off brand showing
+ `string` - will turn on showing brand and will set title you set.
+ `HrefConfig` - will turn on brand showing with `title` and `link` keys, also including `icon`, `id` and `accessRightsToken`

Several examples:

```javascript
module.exports.adminpanel = {
    // Here all navbar configuration could be set
    brand: {
        link: {
            id: 1,
            title: 'Google',
            link: 'google.com',
            icon: 'google',
            accessRightsToken: 'redirect-google-link'
        }
    }
};
```

```javascript
module.exports.adminpanel = {
    // Here all navbar configuration could be set
    brand: {
        link: 'Super Admin' // Will set text to `Super Admin` into brand
    }
};
```

```javascript
module.exports.adminpanel = {
    // Here all navbar configuration could be set
    brand: false
};
```

## Navbar icons
Right now icons for navbar are available.

For now only [Line awesome](https://icons8.com/line-awesome) icons are supported.

You can set icon to navbar item/group using `icon` key in config file.
But you should use icon class without `la-` prefix. **It will be added automatically !**

```javascript
module.exports.adminpanel = {
    entities: {
        user: {
            model: 'User',
            title: 'Users',
            icon: 'user' // glyphicon-user icon will be added to navbar
        }
    }
};
```

