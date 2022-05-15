# Menu configuration

Menu in admin panel could be configured using `menu` key in main `adminpanel` configuration object.

```javascript
module.exports.adminpanel = {
    // Here all menu configuration could be set
    menu: {
        // ...
    }
};
```

## Brand configuration

To configure brand in admin panel you could use `brand` key.

It could be set in several ways:

+ `boolean` - will turn on/off brand showing
+ `string` - will turn on showing brand and will set title you set.
+ `object` - will turn on brand showing with `title` and `link` keys. That could set text and link for brand.

Several examples:

```javascript
module.exports.adminpanel = {
    // Here all menu configuration could be set
    menu: {
        brand: false // turn off brand block
    }
};
```

```javascript
module.exports.adminpanel = {
    // Here all menu configuration could be set
    menu: {
        brand: 'Super Admin' // Will set text to `Super Admin` into brand
    }
};
```

```javascript
module.exports.adminpanel = {
    // Here all menu configuration could be set
    menu: {
        brand: {
            title: 'Admin', // Set text to `Admin`
            link: '/admin/users' // Will set link to `/admin/users`
        }
    }
};
```

## Menu

```javascript
module.exports.adminpanel = {
    
    instances: {
        users: {
            menuGroup: 'users',
            title: 'List of users',
            model: 'User'
        },

        moderators: {
            menuGroup: 'users',
            title: 'List of Moderators',
            model: 'Moderator'
        },

        article: {
            menuGroup: 'content',
            title: 'Articles',
            model: 'Article'
        }
    }
};
```

This configuration will create a 2 dropdown menu items.

## Menu icons
Right now icons for menu are available.

For now only [Line awesome](https://icons8.com/line-awesome) icons are supported.

You can set icon to menu item/group using `icon` key in config file.
But you should use icon class without `la-` prefix. **It will be added automatically !**

```javascript
module.exports.adminpanel = {
    instances: {
        user: {
            model: 'User',
            title: 'Users',
            icon: 'user' // glyphicon-user icon will be added to menu
        }
    }
};
```

## Custom menues

You can add a new custom menues for your custom pages or whatever else...

To add custom menu to your header menues you have to use `actions` (**Array**) key into `menu` configuration.

```javascript
module.exports.adminpanel = {
    menu: {
        actions: [
            {
                link: '/', // Menu link
                title: 'Home', // Title
                icon: 'home' // Icon
            },
            {
                link: '/some/action',
                title: 'Some new action'
            }
        ]
    }
};
```

