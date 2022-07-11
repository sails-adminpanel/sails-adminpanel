# Custom links
You can add custom links into your admin panel pages.

You could use:
- `additionaLinks` in `navbar` property to create links at the top of the sidenav panel
- `global` or `inline` actions in `actions` property of `list` view
- `tools` property to create link like entity submenu

## Action buttons

```javascript
module.exports.adminpanel = {
    navbar: {
        additionalLinks: [
            {
                id: '1',
                title: "First action",
                link: string,
                icon: "",
                subItems: HrefConfig[], // second level links like entity tools
                accessRightsToken: "firstLinkToken"
            }
        ]
    },
    entities: {
        pages: {
            title: 'Pages',
            model: 'Page',
            tools: [
                {
                    id: "0",
                    link: "/",
                    title: "Some new action",
                    icon: "ok",
                    accessRightsToken: "someLinkToken"
                }
            ],

            list: {
                actions: {
                    // Actions in top right corner
                    global: [
                        {
                            id: '2',
                            link: '/',
                            title: 'Some new action',
                            icon: 'ok',
                            accessRightsToken: "secondLinkToken"
                        }
                    ],
                    // Inline actions for every
                    inline: [
                        {
                            id: '2',
                            link: '/',
                            title: 'Something', // Will be added as alt to img
                            icon: 'trash',
                            accessRightsToken: "thirdLinkToken"
                        }
                    ]
                }
            }
        }
    }
};
```
