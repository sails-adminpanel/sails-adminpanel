import { TimeEditor } from "../../editors/timeEditor";
import { timeRenderer } from "../../renderers/timeRenderer";
import { timeValidator } from "../../validators/timeValidator";
export var CELL_TYPE = 'time';
export var TimeCellType = {
  CELL_TYPE: CELL_TYPE,
  editor: TimeEditor,
  renderer: timeRenderer,
  validator: timeValidator
};
