import { DateEditor } from "../../editors/dateEditor";
import { autocompleteRenderer } from "../../renderers/autocompleteRenderer";
import { dateValidator } from "../../validators/dateValidator";
export var CELL_TYPE = 'date';
export var DateCellType = {
  CELL_TYPE: CELL_TYPE,
  editor: DateEditor,
  // displays small gray arrow on right side of the cell
  renderer: autocompleteRenderer,
  validator: dateValidator
};
