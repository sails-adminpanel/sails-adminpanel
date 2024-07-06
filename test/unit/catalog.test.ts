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
        icon: 'icon-item1.1.1',
        type: 'item1'
      };

      const results = await testCatalog.search<Item>(searchQuery);
      // Проверяем, что найденный элемент соответствует ожидаемому
      expect(results).to.be.an('array').that.is.not.empty;
      const foundItem = results.find(item => item.id === expectedItem.id);
      expect(foundItem).to.deep.equal(expectedItem);
      expect(results.length).to.equal(3);
    });

    it('should return empty array for non-matching query', async function () {
      const searchQuery = 'Non-Existent Item';
      const results = await testCatalog.search<Item>(searchQuery);

      expect(results).to.be.an('array').that.is.empty;
    });

    // Добавьте другие тесты по необходимости
  });
});
