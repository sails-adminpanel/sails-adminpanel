"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
describe('Enough hook methods sails.adminpanel...', function () {
    it("addModelConfig", async function () {
        let testModel = {
            test: {
                title: "test",
                model: "test",
                icon: "test"
            }
        };
        sails.hooks.adminpanel.addModelConfig(testModel);
        (0, chai_1.expect)(sails.config.adminpanel.models.test.title).to.equal("test");
    });
});
