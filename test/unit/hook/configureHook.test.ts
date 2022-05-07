import {expect} from "chai";

describe('Adminpanel config test', function() {

    it('adminpanel object should exist', function() {
        expect(sails.config.views.locals.adminpanel).to.exist.and.to.be.instanceOf(Object);
    });
});
