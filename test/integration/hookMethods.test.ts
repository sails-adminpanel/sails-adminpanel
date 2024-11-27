import "mocha";
import { expect } from "chai";

describe('Hook methods sails.adminpanel...', function () {
  it("addModelConfig", async function () {
    let categoryModel = {
      category: {
        title: 'Category',
        model: 'category',
        icon: 'cat'
      }
    }

    sails.hooks.adminpanel.addModelConfig(categoryModel);
    //@ts-ignore
    expect(adminizer.config.models.category.title).to.equal("Category")
  })
})
