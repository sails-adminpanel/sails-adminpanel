import {expect} from "chai";

describe('Adminpanel routes test', function() {

    it('routes exist', function() {
        expect(sails.config.views).to.exist;
    });

});
