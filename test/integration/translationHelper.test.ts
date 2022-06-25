import "mocha";
import {expect} from "chai";
import {TranslationHelper} from "../../helper/translationHelper";

describe('Translation helper', function () {
    it('Load custom translations test', function () {
        let projectTranslations = '../datamocks/locales/adminpanel';
        let expectedLocales = require("../datamocks/testLocales.json");
        TranslationHelper.loadTranslations(projectTranslations);
        //console.log("Locales: ", sails.hooks.i18n.getLocales())
        expect(sails.hooks.i18n.getLocales().en).to.include(expectedLocales.en);
    });

    // 1. Локали не установлены и берутся из sails.config.adminpanel.translation.locales
    // 2. Есть локали внутри админки и локали в проекте и они должны смерджиться в sails.hooks.i18n.locales
    it("Check locales", function () {

    })
});

