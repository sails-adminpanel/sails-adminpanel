"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestData = createTestData;
const TestCatalog_1 = require("./TestCatalog");
async function createTestData() {
    const group1 = {
        id: '1',
        name: 'Group 1',
        parentId: null,
        sortOrder: 1,
        icon: 'audio-description',
        type: 'group',
    };
    const group2 = {
        id: '2',
        name: 'Group 2',
        parentId: null,
        sortOrder: 2,
        icon: 'audio-description',
        type: 'group',
    };
    const group3 = {
        id: '3',
        name: 'Group 3',
        parentId: null,
        sortOrder: 3,
        icon: 'audio-description',
        type: 'group',
    };
    const groups = [group1, group2, group3];
    for (let i = 0; i < groups.length; i++) {
        for (let j = 1; j <= 2; j++) {
            const subGroup = {
                id: `${groups[i].id}.${j}`,
                name: `Group ${groups[i].id}.${j}`,
                parentId: groups[i].id,
                sortOrder: j,
                icon: 'audio-description',
                type: 'group',
            };
            for (let k = 1; k <= 3; k++) {
                const item = {
                    id: `${groups[i].id}.${j}.${k}`,
                    name: `Item ${groups[i].id}.${j}.${k}`,
                    parentId: subGroup.id,
                    sortOrder: k,
                    icon: 'radiation-alt',
                    type: 'item2'
                };
                await TestCatalog_1.StorageService.setElement(item.id, item);
            }
            await TestCatalog_1.StorageService.setElement(subGroup.id, subGroup);
        }
        await TestCatalog_1.StorageService.setElement(groups[i].id, groups[i]);
    }
}
