var _Handsontable$cellTyp, _Handsontable$editors, _Handsontable$rendere, _Handsontable$validat, _Handsontable$plugins;

import "core-js/modules/es.object.get-own-property-names.js";
import Handsontable from "./base.d.ts";
import { registerAllModules } from "./registry.d.ts";
import EventManager, { getListenersCounter } from "./eventManager.d.ts";
import { getRegisteredMapsCounter } from "./translations";
import jQueryWrapper from "./helpers/wrappers/jquery.mjs";
import GhostTable from "./utils/ghostTable.mjs";
import * as parseTableHelpers from "./utils/parseTable.d.ts";
import * as arrayHelpers from "./helpers/array.d.ts";
import * as browserHelpers from "./helpers/browser.d.ts";
import * as dataHelpers from "./helpers/data.d.ts";
import * as dateHelpers from "./helpers/date.d.ts";
import * as featureHelpers from "./helpers/feature.d.ts";
import * as functionHelpers from "./helpers/function.d.ts";
import * as mixedHelpers from "./helpers/mixed.d.ts";
import * as numberHelpers from "./helpers/number.d.ts";
import * as objectHelpers from "./helpers/object.d.ts";
import * as stringHelpers from "./helpers/string.d.ts";
import * as unicodeHelpers from "./helpers/unicode.d.ts";
import * as domHelpers from "./helpers/dom/element.d.ts";
import * as domEventHelpers from "./helpers/dom/event.d.ts";
import { getRegisteredEditorNames, getEditor, registerEditor } from "./editors/registry.d.ts";
import { getRegisteredRendererNames, getRenderer, registerRenderer } from "./renderers/registry.d.ts";
import { getRegisteredValidatorNames, getValidator, registerValidator } from "./validators/registry.d.ts";
import { getRegisteredCellTypeNames, getCellType, registerCellType } from "./cellTypes/registry.d.ts";
import { getPluginsNames, getPlugin, registerPlugin } from "./plugins/registry.d.ts";
import { BasePlugin } from "./plugins/base";
registerAllModules();
jQueryWrapper(Handsontable); // TODO: Remove this exports after rewrite tests about this module

Handsontable.__GhostTable = GhostTable;
Handsontable._getListenersCounter = getListenersCounter; // For MemoryLeak tests

Handsontable._getRegisteredMapsCounter = getRegisteredMapsCounter; // For MemoryLeak tests

Handsontable.EventManager = EventManager; // Export all helpers to the Handsontable object

var HELPERS = [arrayHelpers, browserHelpers, dataHelpers, dateHelpers, featureHelpers, functionHelpers, mixedHelpers, numberHelpers, objectHelpers, stringHelpers, unicodeHelpers, parseTableHelpers];
var DOM = [domHelpers, domEventHelpers];
Handsontable.helper = {};
Handsontable.dom = {}; // Fill general helpers.

arrayHelpers.arrayEach(HELPERS, function (helper) {
  arrayHelpers.arrayEach(Object.getOwnPropertyNames(helper), function (key) {
    if (key.charAt(0) !== '_') {
      Handsontable.helper[key] = helper[key];
    }
  });
}); // Fill DOM helpers.

arrayHelpers.arrayEach(DOM, function (helper) {
  arrayHelpers.arrayEach(Object.getOwnPropertyNames(helper), function (key) {
    if (key.charAt(0) !== '_') {
      Handsontable.dom[key] = helper[key];
    }
  });
}); // Export cell types.

Handsontable.cellTypes = (_Handsontable$cellTyp = Handsontable.cellTypes) !== null && _Handsontable$cellTyp !== void 0 ? _Handsontable$cellTyp : {};
arrayHelpers.arrayEach(getRegisteredCellTypeNames(), function (cellTypeName) {
  Handsontable.cellTypes[cellTypeName] = getCellType(cellTypeName);
});
Handsontable.cellTypes.registerCellType = registerCellType;
Handsontable.cellTypes.getCellType = getCellType; // Export all registered editors from the Handsontable.

Handsontable.editors = (_Handsontable$editors = Handsontable.editors) !== null && _Handsontable$editors !== void 0 ? _Handsontable$editors : {};
arrayHelpers.arrayEach(getRegisteredEditorNames(), function (editorName) {
  Handsontable.editors["".concat(stringHelpers.toUpperCaseFirst(editorName), "Editor")] = getEditor(editorName);
});
Handsontable.editors.registerEditor = registerEditor;
Handsontable.editors.getEditor = getEditor; // Export all registered renderers from the Handsontable.

Handsontable.renderers = (_Handsontable$rendere = Handsontable.renderers) !== null && _Handsontable$rendere !== void 0 ? _Handsontable$rendere : {};
arrayHelpers.arrayEach(getRegisteredRendererNames(), function (rendererName) {
  var renderer = getRenderer(rendererName);

  if (rendererName === 'base') {
    Handsontable.renderers.cellDecorator = renderer;
  }

  Handsontable.renderers["".concat(stringHelpers.toUpperCaseFirst(rendererName), "Renderer")] = renderer;
});
Handsontable.renderers.registerRenderer = registerRenderer;
Handsontable.renderers.getRenderer = getRenderer; // Export all registered validators from the Handsontable.

Handsontable.validators = (_Handsontable$validat = Handsontable.validators) !== null && _Handsontable$validat !== void 0 ? _Handsontable$validat : {};
arrayHelpers.arrayEach(getRegisteredValidatorNames(), function (validatorName) {
  Handsontable.validators["".concat(stringHelpers.toUpperCaseFirst(validatorName), "Validator")] = getValidator(validatorName);
});
Handsontable.validators.registerValidator = registerValidator;
Handsontable.validators.getValidator = getValidator; // Export all registered plugins from the Handsontable.
// Make sure to initialize the plugin dictionary as an empty object. Otherwise, while
// transpiling the files into ES and CommonJS format, the injected CoreJS helper
// `import "core-js/modules/es.object.get-own-property-names";` won't be processed
// by the `./config/plugin/babel/add-import-extension` babel plugin. Thus, the distribution
// files will be broken. The reason is not known right now (probably it's caused by bug in
// the Babel or missing something in the plugin).

Handsontable.plugins = (_Handsontable$plugins = Handsontable.plugins) !== null && _Handsontable$plugins !== void 0 ? _Handsontable$plugins : {};
arrayHelpers.arrayEach(getPluginsNames(), function (pluginName) {
  Handsontable.plugins[pluginName] = getPlugin(pluginName);
});
Handsontable.plugins["".concat(stringHelpers.toUpperCaseFirst(BasePlugin.PLUGIN_KEY), "Plugin")] = BasePlugin;
Handsontable.plugins.registerPlugin = registerPlugin;
Handsontable.plugins.getPlugin = getPlugin;
export default Handsontable;
