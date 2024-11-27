"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
describe('Hook methods sails.adminpanel...', function () {
    it("addModelConfig", async function () {
        let categoryModel = {
            category: {
                title: 'Category',
                model: 'category',
                icon: 'cat'
            }
        };
        sails.hooks.adminpanel.addModelConfig(categoryModel);
        //@ts-ignore
        (0, chai_1.expect)(adminizer.config.models.category.title).to.equal("Category");
    });
});
