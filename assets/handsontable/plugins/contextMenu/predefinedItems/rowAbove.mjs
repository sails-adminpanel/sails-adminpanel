import { getValidSelection } from "../utils.mjs";
import * as C from "../../../i18n/constants.mjs";
export var KEY = 'row_above';
/**
 * @returns {object}
 */

export default function rowAboveItem() {
  return {
    key: KEY,
    name: function name() {
      return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_ROW_ABOVE);
    },
    callback: function callback(key, normalizedSelection) {
      var isSelectedByCorner = this.selection.isSelectedByCorner();
      var rowAbove = 0;

      if (!isSelectedByCorner) {
        var latestSelection = normalizedSelection[Math.max(normalizedSelection.length - 1, 0)];
        rowAbove = latestSelection.start.row;
      }

      this.alter('insert_row', rowAbove, 1, 'ContextMenu.rowAbove');

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
        var totalRows = this.countRows(); // Enable "Insert row above" only when there is at least one row.

        return totalRows === 0;
      }

      return this.selection.isSelectedByColumnHeader() || this.countRows() >= this.getSettings().maxRows;
    },
    hidden: function hidden() {
      return !this.getSettings().allowInsertRow;
    }
  };
}