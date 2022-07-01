import { TextEditor } from "../../editors/textEditor";
import { textRenderer } from "../../renderers/textRenderer";
export var CELL_TYPE = 'text';
export var TextCellType = {
  CELL_TYPE: CELL_TYPE,
  editor: TextEditor,
  renderer: textRenderer
};
