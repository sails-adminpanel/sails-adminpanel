import { NumericEditor } from "../../editors/numericEditor";
import { numericRenderer } from "../../renderers/numericRenderer";
import { numericValidator } from "../../validators/numericValidator";
export var CELL_TYPE = 'numeric';
export var NumericCellType = {
  CELL_TYPE: CELL_TYPE,
  editor: NumericEditor,
  renderer: numericRenderer,
  validator: numericValidator,
  dataType: 'number'
};
