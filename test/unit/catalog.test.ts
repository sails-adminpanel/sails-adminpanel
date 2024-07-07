import { expect } from 'chai';
import { TestCatalog, StorageService } from '../TestCatalog/TestCatalog';
import { createTestData } from "../TestCatalog/genData";
import { Item } from '../../lib/catalog/AbstractCatalog';

describe('Catalog', function () {
  let testCatalog!: TestCatalog;

  before(async function () {
    await createTestData();
    testCatalog = new TestCatalog();
  });



  describe('search()', function () {
    it('should find items by name', async function () {
      const searchQuery = 'Item 1.1.1';
      const expectedItem = {
        id: '1.1.1',
        name: 'Item 1.1.1',
        parentId: '1.1',
        sortOrder: 1,
        marked: true,
        icon: 'icon-item1.1.1',
        type: 'item1'
      };

      const results = await testCatalog.search<Item>(searchQuery);
      // Проверяем, что найденный элемент соответствует ожидаемому
      expect(results).to.be.an('array').that.is.not.empty;
      const foundItem = results.find(item => item.id === expectedItem.id);
      expect(foundItem).to.deep.equal(expectedItem);
      expect(results.length).to.equal(6);
    });

    it('should return empty array for non-matching query', async function () {
      const searchQuery = 'Non-Existent Item';
      const results = await testCatalog.search<Item>(searchQuery);

      expect(results).to.be.an('array').that.is.empty;
    });

    it('should build a tree structure correctly', () => {
      const items = [
        { id: 1, name: "Item 1", parentId: null, sortOrder: 1, icon: "icon1", type: "type1" },
        { id: 2, name: "Item 2", parentId: 1, sortOrder: 2, icon: "icon2", type: "type2" },
        { id: 3, name: "Item 3", parentId: 1, sortOrder: 3, icon: "icon3", type: "type3" },
        { id: 4, name: "Item 4", parentId: 2, sortOrder: 4, icon: "icon4", type: "type4" },
        { id: 5, name: "Item 5", parentId: null, sortOrder: 5, icon: "icon5", type: "type5" }
      ];

      const tree = TestCatalog.buildTree(items);

      // Assertions
      expect(tree).to.be.an('array').with.length(2); // Assuming there are 2 root items
      expect(tree[0].name).to.equal("Item 1");
      expect(tree[0].childs).to.be.an('array').with.length(2); // Item 1 should have 2 children
      expect(tree[0].childs[0].name).to.equal("Item 2");
      expect(tree[0].childs[1].name).to.equal("Item 3");
      expect(tree[1].name).to.equal("Item 5"); // Second root item
    });

    // Добавьте другие тесты по необходимости
  });
});
