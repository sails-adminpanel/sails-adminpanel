import {expect} from "chai";
let AdminUtil = require('../../../lib/adminUtil');

describe('adminUtil :: _isValidInstanceConfig()', function() {

    it('fail if not Object given', function() {
        expect(AdminUtil._isValidInstanceConfig()).to.be.false;
        expect(AdminUtil._isValidInstanceConfig('')).to.be.false;
        expect(AdminUtil._isValidInstanceConfig(null)).to.be.false;
        expect(AdminUtil._isValidInstanceConfig(true)).to.be.false;
    });

    it('fail if no `model` exist', function() {
        expect(AdminUtil._isValidInstanceConfig({})).to.be.false;
        expect(AdminUtil._isValidInstanceConfig({model: 'User'})).to.be.true;
    });
});
