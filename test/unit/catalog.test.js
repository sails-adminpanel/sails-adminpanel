"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const TestCatalog_1 = require("../TestCatalog/TestCatalog");
const genData_1 = require("../TestCatalog/genData");
describe('Catalog', function () {
    let testCatalog;
    before(async function () {
        await (0, genData_1.createTestData)();
        testCatalog = new TestCatalog_1.TestCatalog();
    });
    describe('search()', function () {
        it('should find items by name', async function () {
            const searchQuery = 'Item 1.1.1';
            const expectedItem = {
                id: '1.1.1',
                name: 'Item 1.1.1',
                parentId: '1.1',
                sortOrder: 1,
                icon: 'icon-item1.1.1',
                type: 'item1'
            };
            const results = await testCatalog.search(searchQuery);
            // Проверяем, что найденный элемент соответствует ожидаемому
            (0, chai_1.expect)(results).to.be.an('array').that.is.not.empty;
            const foundItem = results.find(item => item.id === expectedItem.id);
            (0, chai_1.expect)(foundItem).to.deep.equal(expectedItem);
            (0, chai_1.expect)(results.length).to.equal(3);
        });
        it('should return empty array for non-matching query', async function () {
            const searchQuery = 'Non-Existent Item';
            const results = await testCatalog.search(searchQuery);
            (0, chai_1.expect)(results).to.be.an('array').that.is.empty;
        });
        // Добавьте другие тесты по необходимости
    });
});
