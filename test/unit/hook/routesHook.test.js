"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
describe('Adminpanel routes test', function () {
    it('routes exist', function () {
        (0, chai_1.expect)(sails.config.views).to.exist;
    });
});
