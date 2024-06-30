"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
describe('Access rights helper test', function () {
    it("Access rights methods exists", async function () {
        (0, chai_1.expect)(sails.hooks.adminpanel.registerAccessToken).to.exist;
        (0, chai_1.expect)(sails.hooks.adminpanel.getAllAccessTokens).to.exist;
        (0, chai_1.expect)(sails.hooks.adminpanel.havePermission).to.exist;
    });
    it("Default (CRUD) tokens created for every entity test", function () {
        let entities = sails.config.adminpanel.models;
        let forms = sails.config.adminpanel.forms.data;
        let entitiesAmount = Object.keys(entities).length;
        let formsAmount = Object.keys(forms).length;
        //console.log(1,entities,forms)
        let tokensAmount = accessRightsHelper_1.AccessRightsHelper.getTokens().length;
        console.log(2, accessRightsHelper_1.AccessRightsHelper.getTokens());
        (0, chai_1.expect)(tokensAmount).to.equal(4 * (entitiesAmount + formsAmount) + 2); // 4 for every entity and form + 2 routes for migrations
    });
});
