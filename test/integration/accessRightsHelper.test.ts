import "mocha";
import {expect} from "chai";
import {AccessRightsHelper} from "../../helper/accessRightsHelper";

describe('Access rights helper test', function () {
    it("Access rights methods exists", async function() {
        expect(sails.hooks.adminpanel.registerAccessToken).to.exist;
        expect(sails.hooks.adminpanel.getAllAccessTokens).to.exist;
    })

    it("Default (CRUD) tokens created for every instance test", function () {
        let instances = sails.config.adminpanel.instances;
        let instancesAmount = Object.keys(instances).length;
        let tokensAmount = AccessRightsHelper.getTokens().length;
        expect(tokensAmount).to.equal(4 * instancesAmount)
    })
})
