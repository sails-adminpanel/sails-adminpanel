"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
describe('Access rights helper test', function () {
    it("Access rights methods exists", async function () {
        (0, chai_1.expect)(sails.hooks.adminpanel.registerAccessToken).to.exist;
        (0, chai_1.expect)(sails.hooks.adminpanel.getAllAccessTokens).to.exist;
    });
});
