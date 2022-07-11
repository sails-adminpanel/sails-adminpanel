# Edit callback

entityModifier - function in adminpanel config edit sections for modification entity data
before save in database.

```
module.exports.adminpanel = {
    entities: {
        users: {
            title: 'Users',
            model: 'User',
            add: {
                fields: {
                },
                // saved object to be modificated before save in database
                entityModifier: function (entity) {
                    entity.human_edited = true;
                    return entity;
                },
            }
        }
    }
}

```


# Display modifier

It uses to manage fields' views

```javascript
displayModifier: function (data) {
    // for list view
    if (Array.isArray(data)) {
        data = data.map((item) => {return item.label + item.date})
        return data.join(',')
    }
    // for edit view    
    return data.label + data.date
}
```