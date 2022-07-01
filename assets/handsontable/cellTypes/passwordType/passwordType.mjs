import { PasswordEditor } from "../../editors/passwordEditor";
import { passwordRenderer } from "../../renderers/passwordRenderer";
export var CELL_TYPE = 'password';
export var PasswordCellType = {
  CELL_TYPE: CELL_TYPE,
  editor: PasswordEditor,
  renderer: passwordRenderer,
  copyable: false
};
