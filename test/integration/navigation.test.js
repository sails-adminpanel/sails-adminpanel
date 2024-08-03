"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const chai_1 = require("chai");
chai.use(chaiHttp);
describe('Navigation', function () {
    this.timeout(50000);
    it("Check if the navigation is added correctly", async function () {
        let CatalogHandler = sails.hooks.adminpanel.CatalogHandler();
        let navigation = await CatalogHandler.getCatalog('navigation');
        (0, chai_1.expect)(navigation.slug).to.equal('navigation');
    });
    it("Checking access rights", async function () {
        await GroupAP.destroy({ name: "Test Group" });
        await UserAP.destroy({ login: "test" });
        let agent = chai.request.agent(sails.hooks.http.app);
        agent.post('/admin/model/userap/login')
            .type('form')
            .send({ login: "test", password: "test" })
            .then(function (res) {
            agent.get('/admin/catalog/navigation/header')
                .then(function (res2) {
                res2.should.have.status(403);
            });
        });
    });
    it("Write data", async function () {
        let agent = chai.request.agent(sails.hooks.http.app);
        let s = '';
        const res = await agent.post('/admin/model/page/add')
            .type('form')
            .send({
            "name": "Page 1",
            "slug": "page-1",
            "about": "zxc",
            "text": "<p>zxc</p>",
            "json": true
        });
        await agent.post('/admin/catalog/navigation/header')
            .type('form')
            .send({ data: { record: res.body.record, parentId: "", type: "page" }, _method: 'createItem' });
        await agent.post('/admin/catalog/navigation/header')
            .type('form')
            .send({ _method: 'getCatalog' });
        await agent.post('/admin/catalog/navigation/header')
            .type('json')
            .send({
            "data": {
                "parentId": "",
                "type": "group",
                "targetBlank": true,
                "name": "Group 1",
                "link": "link 1",
                "test_field": "test 1"
            },
            "_method": "createItem"
        });
        const res5 = await agent.post('/admin/catalog/navigation/header')
            .type('form')
            .send({ _method: 'getCatalog' });
        let page_1 = res5.body.catalog.nodes.filter((e) => e.title === 'Page 1');
        let group_1 = res5.body.catalog.nodes.filter((e_1) => e_1.title === 'Group 1');
        await agent.put('/admin/catalog/navigation/header')
            .type('json')
            .send({
            "data": {
                "reqNode": {
                    "title": "Page 1",
                    "isLeaf": true,
                    "children": [],
                    "isSelected": true,
                    "isExpanded": false,
                    "isVisible": true,
                    "isDraggable": true,
                    "isSelectable": true,
                    "data": {
                        "id": page_1[0].data.id,
                        "modelId": page_1[0].data.modelId,
                        "targetBlank": false,
                        "name": "Page 1",
                        "parentId": null,
                        "sortOrder": 0,
                        "icon": "wrench",
                        "type": "page",
                        "urlPath": "/page/page-1"
                    },
                    "path": [
                        0
                    ],
                    "pathStr": "[0]",
                    "level": 1,
                    "ind": 0,
                    "isFirstChild": true,
                    "isLastChild": false
                },
                "reqParent": {
                    "title": "Group 1",
                    "isLeaf": false,
                    "children": [
                        {
                            "title": "Page 1",
                            "isLeaf": true,
                            "children": [],
                            "isSelected": true,
                            "isExpanded": false,
                            "isVisible": false,
                            "isDraggable": true,
                            "isSelectable": true,
                            "data": {
                                "id": page_1[0].data.id,
                                "modelId": page_1[0].data.modelId,
                                "targetBlank": false,
                                "name": "Page 1",
                                "parentId": null,
                                "sortOrder": 0,
                                "icon": "wrench",
                                "type": "page",
                                "urlPath": "/page/page-1"
                            },
                            "path": [
                                0,
                                0
                            ],
                            "pathStr": "[0,0]",
                            "level": 2,
                            "ind": 0,
                            "isFirstChild": true,
                            "isLastChild": true
                        }
                    ],
                    "isSelected": false,
                    "isExpanded": false,
                    "isVisible": true,
                    "isDraggable": true,
                    "isSelectable": true,
                    "data": {
                        "id": group_1[0].data.id,
                        "name": "Group 1",
                        "targetBlank": true,
                        "parentId": null,
                        "sortOrder": 1,
                        "icon": "folder",
                        "type": "group",
                        "link": "link 1",
                        "test_field": "test 1"
                    },
                    "path": [
                        0
                    ],
                    "pathStr": "[0]",
                    "level": 1,
                    "ind": 0,
                    "isFirstChild": true,
                    "isLastChild": true
                }
            },
            "_method": "updateTree"
        });
        const finally_res = await agent.post('/admin/catalog/navigation/header')
            .type('json')
            .send({
            data: {
                "data": {
                    "id": group_1[0].data.id,
                    "name": "Group 1",
                    "targetBlank": true,
                    "parentId": null,
                    "sortOrder": 1,
                    "icon": "folder",
                    "type": "group",
                    "link": "link 1",
                    "test_field": "test 1"
                },
            }, _method: 'getChilds'
        });
        s = finally_res.body.data.find((e_2) => e_2.title === 'Page 1').title;
        // console.log(s)
        (0, chai_1.expect)(s).to.equal('Page 1');
    });
});
