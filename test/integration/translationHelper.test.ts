import "mocha";
import {expect} from "chai";
import {TranslationHelper} from "../../helper/translationHelper";

describe('Translation helper', function () {
    it('Load custom translations test', function () {
        let projectTranslations = '../datamocks/locales/adminpanel';
        let expectedLocales = require("../datamocks/testLocales.json");
        TranslationHelper.loadTranslations(projectTranslations);
        //console.log("Locales: ", sails.hooks.i18n.getLocales())
        expect(sails.hooks.i18n.getLocales()).to.equal(expectedLocales)
    });
});

