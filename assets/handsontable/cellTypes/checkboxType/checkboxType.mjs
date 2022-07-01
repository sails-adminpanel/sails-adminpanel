import { CheckboxEditor } from "../../editors/checkboxEditor";
import { checkboxRenderer } from "../../renderers/checkboxRenderer";
export var CELL_TYPE = 'checkbox';
export var CheckboxCellType = {
  CELL_TYPE: CELL_TYPE,
  editor: CheckboxEditor,
  renderer: checkboxRenderer
};
