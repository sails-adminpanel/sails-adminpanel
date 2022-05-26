"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
describe('Access rights helper test', function () {
    it("Access rights methods exists", async function () {
        (0, chai_1.expect)(sails.hooks.adminpanel.registerAccessToken).to.exist;
        (0, chai_1.expect)(sails.hooks.adminpanel.getAllAccessTokens).to.exist;
    });
    it("Default (CRUD) tokens created for every instance test", function () {
        let instances = sails.config.adminpanel.instances;
        let instancesAmount = Object.keys(instances).length;
        let tokensAmount = accessRightsHelper_1.AccessRightsHelper.getTokens().length;
        (0, chai_1.expect)(tokensAmount).to.equal(4 * instancesAmount);
    });
});
