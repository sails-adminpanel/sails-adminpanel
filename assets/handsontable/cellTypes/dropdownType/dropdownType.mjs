import { DropdownEditor } from "../../editors/dropdownEditor";
import { autocompleteRenderer } from "../../renderers/autocompleteRenderer";
import { autocompleteValidator } from "../../validators/autocompleteValidator";
export var CELL_TYPE = 'dropdown';
export var DropdownCellType = {
  CELL_TYPE: CELL_TYPE,
  editor: DropdownEditor,
  // displays small gray arrow on right side of the cell
  renderer: autocompleteRenderer,
  validator: autocompleteValidator
};
