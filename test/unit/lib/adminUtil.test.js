"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
let AdminUtil = require('../../../lib/adminUtil');
describe('adminUtil :: _isValidInstanceConfig()', function () {
    it('fail if not Object given', function () {
        (0, chai_1.expect)(AdminUtil._isValidInstanceConfig()).to.be.false;
        (0, chai_1.expect)(AdminUtil._isValidInstanceConfig('')).to.be.false;
        (0, chai_1.expect)(AdminUtil._isValidInstanceConfig(null)).to.be.false;
        (0, chai_1.expect)(AdminUtil._isValidInstanceConfig(true)).to.be.false;
    });
    it('fail if no `model` exist', function () {
        (0, chai_1.expect)(AdminUtil._isValidInstanceConfig({})).to.be.false;
        (0, chai_1.expect)(AdminUtil._isValidInstanceConfig({ model: 'User' })).to.be.true;
    });
});
