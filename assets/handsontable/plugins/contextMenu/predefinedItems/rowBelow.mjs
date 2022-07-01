import { getValidSelection } from "../utils.mjs";
import { isDefined } from "../../../helpers/mixed.d.ts";
import * as C from "../../../i18n/constants.mjs";
export var KEY = 'row_below';
/**
 * @returns {object}
 */

export default function rowBelowItem() {
  return {
    key: KEY,
    name: function name() {
      return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_ROW_BELOW);
    },
    callback: function callback(key, normalizedSelection) {
      var isSelectedByCorner = this.selection.isSelectedByCorner();
      var rowBelow = 0;

      if (isSelectedByCorner) {
        rowBelow = this.countRows();
      } else {
        var _latestSelection$end;

        var latestSelection = normalizedSelection[Math.max(normalizedSelection.length - 1, 0)];
        var selectedRow = latestSelection === null || latestSelection === void 0 ? void 0 : (_latestSelection$end = latestSelection.end) === null || _latestSelection$end === void 0 ? void 0 : _latestSelection$end.row; // If there is no selection we have clicked on the corner and there is no data.

        rowBelow = isDefined(selectedRow) ? selectedRow + 1 : 0;
      }

      this.alter('insert_row', rowBelow, 1, 'ContextMenu.rowBelow');

      if (isSelectedByCorner) {
        this.selectAll();
      }
    },
    disabled: function disabled() {
      var selected = getValidSelection(this);

      if (!selected) {
        return true;
      }

      if (this.selection.isSelectedByCorner()) {
        // Enable "Insert row below" always when the menu is triggered by corner click.
        return false;
      }

      return this.selection.isSelectedByColumnHeader() || this.countRows() >= this.getSettings().maxRows;
    },
    hidden: function hidden() {
      return !this.getSettings().allowInsertRow;
    }
  };
}
