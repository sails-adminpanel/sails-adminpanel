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
        (0, chai_1.expect)(sails.hooks.i18n.getLocales().en).to.include(expectedLocales.en);
    });
    // 1. Локали не установлены и берутся из adminizer.config.translation.locales
    // 2. Есть локали внутри админки и локали в проекте и они должны смерджиться в sails.hooks.i18n.locales
    it("Check locales", function () {
    });
});
