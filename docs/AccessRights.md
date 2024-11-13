# Access Rights
When sails-adminpanel starts, for every Model it creates 4 access rights tokens:
- create
- read
- update
- delete

You can also create custom access rights tokens using function `registerToken` of `AccessRightsHelper`.

These tokens can be used to give users rights to see information of specific Model, to create new models or edit it.
Also, you can use tokens to create access rights to global and inline actions, or to Model tools.
In controllers you should check access rights through `havePermission` method.

Example:

```javascript
if (sails.config.adminpanel.auth) {
        if (!req.session.UserAP) { // check that user is authorized
            return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
        } else if (!AccessRightsHelper.havePermission(`tokenName`, req.session.UserAP)) { // check permission
            return res.sendStatus(403);
        }
    }
```


## Users and Groups
In Model `Users` admin or someone who has access can create user profiles and give them specific access rights by adding them to `Groups`.
`Groups` represent lists of rights tokens, and you can choose which ones you want to add to this group.
After adding tokens to the groups you can add user to specific group and this user will have access rights that
you set to this group.

To do this, go to adminpanel app and in left navbar choose Users and Groups departments.

## Administrator

Add default administrator credentials in adminpanel config. If no admin profiles
will be found, adminpanel will create admin profile with this credentials.
If credentials in config will not be found, adminpanel will create admin with
login `admin` and numeric password that will be displayed in console.

```javascript
module.exports.adminpanel = {
    administrator: {
        login: 'string',
        password: 'string'
    }
}
```

## Fields

Each field can have its own access rights using the `groupAccessRights` attribute. This attribute defines which user groups
are permitted to view or modify a specific field.

```javascript
fields: {
  title: { "title": "Title", "tooltip": "Main title of the item" },
  guardedField: {
    title: "Restricted Field",
    type: "string",
    groupsAccessRight: ["admins", "editors"]
  }
}
```

- In this example: `guardedField` is only accessible to users in the admin and editor groups.
If a user does not belong to one of these groups, the field will be hidden or inaccessible.

- Notes: Fields without groupAccessRights are accessible by default to all users, except guest users which belong
to "Default user group". This mechanism allows fine-grained control over the visibility of fields based on user group membership.

## Records

To control access to specific records, use the `userAccessRelation` field in your model’s configuration. This allows you to
specify a relationship field in your model that associates records with UserAP or GroupAP, enforcing access only for related users or groups.

#### How to Configure Record Access Control
- Define the Relationship Field: In your model, add a field that establishes a relationship (either model or collection) with
the UserAP or GroupAP model. This field will serve as the basis for checking user or group associations.
- Set `userAccessRelation` in the Model Configuration: In the model configuration, specify the name of the relationship field
in the userAccessRelation attribute. This allows the system to filter records based on whether a user belongs to a specified group or is directly associated with the record.

```javascript
/** Example 1 (association) */
// in model configuration
modelname: {
  userAccessRelation: "owner"
}
// in your model’s attributes
{
  attributes: {
    owner: {
      model: "UserAP"
    }
  }
}

/** Example 2 (association-many) */
// in model configuration
modelname: {
  userAccessRelation: "userGroups"
}
// in your model’s attributes
{
  attributes: {
    userGroups: {
      collection: "GroupAP",
      via: "members"
    }
  }
}
```

#### Behavior of userAccessRelation
When a user accesses records, the system evaluates userAccessRelation:
- If the field is related to UserAP, only records where the user ID matches the UserAP relationship field are accessible.
- If the field is related to GroupAP, only records where the user belongs to any group in the GroupAP relationship field are accessible.

The relationship type (either model or collection) determines whether a single user or group or multiple users/groups are associated with the record.
