import Core from "./core.d.ts";
import { rootInstanceSymbol } from "./utils/rootInstance.mjs";
import { metaSchemaFactory } from "./dataMap/index.mjs";
import Hooks from "./pluginHooks.d.ts"; // FIXME: Bug in eslint-plugin-import: https://github.com/benmosher/eslint-plugin-import/issues/1883

/* eslint-disable import/named */

import { dictionaryKeys, getTranslatedPhrase, registerLanguageDictionary, getLanguagesDictionaries, getLanguageDictionary } from "./i18n/registry.d.ts";
/* eslint-enable import/named */

import { registerCellType } from "./cellTypes/registry.d.ts";
import { TextCellType } from "./cellTypes/textType";
import { BaseEditor } from "./editors/baseEditor"; // register default mandatory cell type for the Base package

registerCellType(TextCellType); // export the `BaseEditor` class to the Handsontable global namespace

Handsontable.editors = {
  BaseEditor: BaseEditor
};
/**
 * @param {HTMLElement} rootElement The element to which the Handsontable instance is injected.
 * @param {object} userSettings The user defined options.
 * @returns {Core}
 */

function Handsontable(rootElement, userSettings) {
  var instance = new Core(rootElement, userSettings || {}, rootInstanceSymbol);
  instance.init();
  return instance;
}

Handsontable.Core = function (rootElement) {
  var userSettings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new Core(rootElement, userSettings, rootInstanceSymbol);
};

Handsontable.DefaultSettings = metaSchemaFactory();
Handsontable.hooks = Hooks.getSingleton();
Handsontable.packageName = 'handsontable';
Handsontable.buildDate = "28/06/2022 12:07:22";
Handsontable.version = "12.1.0";
Handsontable.languages = {
  dictionaryKeys: dictionaryKeys,
  getLanguageDictionary: getLanguageDictionary,
  getLanguagesDictionaries: getLanguagesDictionaries,
  registerLanguageDictionary: registerLanguageDictionary,
  getTranslatedPhrase: getTranslatedPhrase
};
export default Handsontable;
