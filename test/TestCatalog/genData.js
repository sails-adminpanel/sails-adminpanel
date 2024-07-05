"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestCatalog_1 = require("./TestCatalog");
const createTestData = async () => {
    const group1 = {
        id: 1,
        name: 'Group 1',
        parentId: null,
        childs: [],
        sortOrder: 1,
        icon: 'icon-group1',
        type: 'group',
        childGroups: []
    };
    const group2 = {
        id: 2,
        name: 'Group 2',
        parentId: null,
        childs: [],
        sortOrder: 2,
        icon: 'icon-group2',
        type: 'group',
        childGroups: []
    };
    const group3 = {
        id: 3,
        name: 'Group 3',
        parentId: null,
        childs: [],
        sortOrder: 3,
        icon: 'icon-group3',
        type: 'group',
        childGroups: []
    };
    const groups = [group1, group2, group3];
    for (let i = 0; i < groups.length; i++) {
        for (let j = 1; j <= 2; j++) {
            const subGroup = {
                id: `${groups[i].id}.${j}`,
                name: `Group ${groups[i].id}.${j}`,
                parentId: groups[i].id,
                childs: [],
                sortOrder: j,
                icon: `icon-group${groups[i].id}.${j}`,
                type: 'subgroup',
                childGroups: []
            };
            for (let k = 1; k <= 3; k++) {
                const item = {
                    id: `${groups[i].id}.${j}.${k}`,
                    name: `Item ${groups[i].id}.${j}.${k}`,
                    parentId: subGroup.id,
                    sortOrder: k,
                    icon: `icon-item${groups[i].id}.${j}.${k}`,
                    type: 'item'
                };
                subGroup.childs?.push(item);
                await TestCatalog_1.StorageService.setElement(item.id, item);
            }
            groups[i].childGroups?.push(subGroup);
            await TestCatalog_1.StorageService.setElement(subGroup.id, subGroup);
        }
        await TestCatalog_1.StorageService.setElement(groups[i].id, groups[i]);
    }
};
createTestData().then(() => {
    console.log('Test data created successfully');
}).catch((err) => {
    console.error('Error creating test data:', err);
});
