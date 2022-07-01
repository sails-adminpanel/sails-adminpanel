import { getValidSelection } from "../utils.mjs";
import * as C from "../../../i18n/constants.mjs";
import { isDefined } from "../../../helpers/mixed.d.ts";
export var KEY = 'col_right';
/**
 * @returns {object}
 */

export default function columnRightItem() {
  return {
    key: KEY,
    name: function name() {
      return this.getTranslatedPhrase(C.CONTEXTMENU_ITEMS_INSERT_RIGHT);
    },
    callback: function callback() {
      var isSelectedByCorner = this.selection.isSelectedByCorner();
      var columnRight = this.isRtl() ? 0 : this.countCols();

      if (!isSelectedByCorner) {
        var selectedRange = this.getSelectedRangeLast(); // If there is no selection we have clicked on the corner and there is no data.

        if (isDefined(selectedRange)) {
          var _selectedRange$getTop = selectedRange.getTopRightCorner(),
              col = _selectedRange$getTop.col;

          columnRight = this.isRtl() ? col : col + 1;
        }
      }

      this.alter('insert_col', columnRight, 1, 'ContextMenu.columnRight');

      if (isSelectedByCorner) {
        this.selectAll();
      }
    },
    disabled: function disabled() {
      if (!this.isColumnModificationAllowed()) {
        return true;
      }

      var selected = getValidSelection(this);

      if (!selected) {
        return true;
      }

      if (this.selection.isSelectedByCorner()) {
        // Enable "Insert column right" always when the menu is triggered by corner click.
        return false;
      }

      return this.selection.isSelectedByRowHeader() || this.countCols() >= this.getSettings().maxCols;
    },
    hidden: function hidden() {
      return !this.getSettings().allowInsertColumn;
    }
  };
}
