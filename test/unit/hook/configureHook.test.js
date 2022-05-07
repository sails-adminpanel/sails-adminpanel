"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
describe('Adminpanel config test', function () {
    it('adminpanel object should exist', function () {
        (0, chai_1.expect)(sails.config.views.locals.adminpanel).to.exist.and.to.be.instanceOf(Object);
    });
});
