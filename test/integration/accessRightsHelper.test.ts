import "mocha";
import {expect} from "chai";
import {AccessRightsHelper} from "../../helper/accessRightsHelper";

describe('Access rights helper test', function () {
    it("Access rights methods exists", async function() {
        expect(sails.hooks.adminpanel.registerAccessToken).to.exist;
        expect(sails.hooks.adminpanel.getAllAccessTokens).to.exist;
        expect(sails.hooks.adminpanel.havePermission).to.exist;
    })

    it("Default (CRUD) tokens created for every instance test", function () {
        let instances = sails.config.adminpanel.instances;
        let forms = sails.config.adminpanel.forms.data;

        let instancesAmount = Object.keys(instances).length;
        let formsAmount = Object.keys(forms).length;

        let tokensAmount = AccessRightsHelper.getTokens().length;
        expect(tokensAmount).to.equal(4 * (instancesAmount + formsAmount))
    })
})
