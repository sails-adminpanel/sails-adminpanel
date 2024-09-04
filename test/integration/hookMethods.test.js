"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
describe('Hook methods sails.adminpanel...', function () {
    it("addModelConfig", async function () {
        let testModel = {
            test: {
                title: "test",
                model: "test",
                icon: "test"
            }
        };
        sails.hooks.adminpanel.addModelConfig(testModel);
        //@ts-ignore
        (0, chai_1.expect)(sails.config.adminpanel.models.test.title).to.equal("test");
    });
});
