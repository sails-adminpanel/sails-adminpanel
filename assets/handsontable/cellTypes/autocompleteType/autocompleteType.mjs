import { AutocompleteEditor } from "../../editors/autocompleteEditor";
import { autocompleteRenderer } from "../../renderers/autocompleteRenderer";
import { autocompleteValidator } from "../../validators/autocompleteValidator";
export var CELL_TYPE = 'autocomplete';
export var AutocompleteCellType = {
  CELL_TYPE: CELL_TYPE,
  editor: AutocompleteEditor,
  renderer: autocompleteRenderer,
  validator: autocompleteValidator
};
