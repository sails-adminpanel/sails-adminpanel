# Access Rights
When sails-adminpanel starts, for every instance it creates 4 access rights tokens:
- create
- read
- update
- delete

You can also create custom access rights tokens using function `registerToken` of `AccessRightsHelper`.

These tokens can be used to give users rights to see information of specific instance, to create new models or edit it.
Also, you can use tokens to create access rights to global and inline actions, or to instance tools.
In controllers you should check access rights through `havePermission` method.

Example:

```javascript
if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) { // check that user is authorized
            return res.redirect(`${sails.config.adminpanel.routePrefix}/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`tokenName`, req.session.UserAP)) { // check permission
            return res.sendStatus(403);
        }
    }
```


## Users and Groups
In instance `Users` admin can create user profiles and give them specific access rights by adding them to `Groups`.
`Groups` represent lists of rights tokens, and you can choose which ones you want to add to this group.
After adding tokens to the groups you can add user to specific group and this user will have access rights that
you set to this group.

To do this, go to adminpanel app and in left navbar choose Users and Groups departments.