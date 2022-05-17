"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const translationHelper_1 = require("../../helper/translationHelper");
describe('Translation helper', function () {
    it('Load custom translations test', function () {
        let projectTranslations = '../datamocks/locales/adminpanel';
        let expectedLocales = require("../datamocks/testLocales.json");
        translationHelper_1.TranslationHelper.loadTranslations(projectTranslations);
        //console.log("Locales: ", sails.hooks.i18n.getLocales())
        (0, chai_1.expect)(sails.hooks.i18n.getLocales()).to.deep.equal(expectedLocales);
    });
});
