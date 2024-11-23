import "mocha";
import { expect } from "chai";
import { AccessRightsHelper } from "../../helper/accessRightsHelper";

describe('Access rights helper test', function() {
    it("Access rights methods exists", async function() {
        expect(sails.hooks.adminpanel.registerAccessToken).to.exist;
        expect(sails.hooks.adminpanel.getAllAccessTokens).to.exist;
        expect(sails.hooks.adminpanel.havePermission).to.exist;
    })

    it("Default (CRUD) tokens created for every entity test", function() {
        let entities = adminizer.config.models;
        let forms = adminizer.config.forms.data;

        let entitiesAmount = Object.keys(entities).length;
        let formsAmount = Object.keys(forms).length;

        //console.log(1,entities,forms)


        let tokensAmount = AccessRightsHelper.getTokens().length;
        console.log(2, AccessRightsHelper.getTokens());

        expect(tokensAmount).to.equal(4 * (entitiesAmount + formsAmount) + 2 + 1 + 1); // 4 for every entity and form + 2 routes for migrations +1 for navigation +1 for mediamanager
    })
})
