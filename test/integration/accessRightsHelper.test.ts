import "mocha";
import {expect} from "chai";

describe('Access rights helper test', function () {
    it("Access rights methods exists", async function() {
        expect(sails.hooks.adminpanel.registerAccessToken).to.exist;
        expect(sails.hooks.adminpanel.getAllAccessTokens).to.exist;
    })
})
