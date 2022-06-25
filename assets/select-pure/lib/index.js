"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Element = require("./components/Element");

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CLASSES = {
  select: "select-pure__select",
  dropdownShown: "select-pure__select--opened",
  multiselect: "select-pure__select--multiple",
  label: "select-pure__label",
  placeholder: "select-pure__placeholder",
  dropdown: "select-pure__options",
  option: "select-pure__option",
  optionDisabled: "select-pure__option--disabled",
  autocompleteInput: "select-pure__autocomplete",
  selectedLabel: "select-pure__selected-label",
  selectedOption: "select-pure__option--selected",
  placeholderHidden: "select-pure__placeholder--hidden",
  optionHidden: "select-pure__option--hidden"
};

var SelectPure = /*#__PURE__*/function () {
  function SelectPure(element, config) {
    _classCallCheck(this, SelectPure);

    this._config = _objectSpread(_objectSpread({}, config), {}, {
      classNames: _objectSpread(_objectSpread({}, CLASSES), config.classNames),
      disabledOptions: []
    });
    this._state = {
      opened: false
    };
    this._icons = [];
    this._boundHandleClick = this._handleClick.bind(this);
    this._boundUnselectOption = this._unselectOption.bind(this);
    this._boundSortOptions = this._sortOptions.bind(this);
    this._body = new _Element2["default"](document.body);

    this._create(element);

    if (!this._config.value) {
      return;
    }

    this._setValue();
  } // Public API


  _createClass(SelectPure, [{
    key: "value",
    value: function value() {
      return this._config.value;
    }
  }, {
    key: "reset",
    value: function reset() {
      this._config.value = this._config.multiple ? [] : null;

      this._setValue();
    } // Private methods

  }, {
    key: "_create",
    value: function _create(_element) {
      var element = typeof _element === "string" ? document.querySelector(_element) : _element;
      this._parent = new _Element2["default"](element);
      this._select = new _Element2["default"]("div", {
        "class": this._config.classNames.select
      });
      this._label = new _Element2["default"]("span", {
        "class": this._config.classNames.label
      });
      this._optionsWrapper = new _Element2["default"]("div", {
        "class": this._config.classNames.dropdown
      });

      if (this._config.multiple) {
        this._select.addClass(this._config.classNames.multiselect);
      }

      this._options = this._generateOptions();

      this._select.addEventListener("click", this._boundHandleClick);

      this._select.append(this._label.get());

      this._select.append(this._optionsWrapper.get());

      this._parent.append(this._select.get());

      this._placeholder = new _Element2["default"]("span", {
        "class": this._config.classNames.placeholder,
        textContent: this._config.placeholder
      });

      this._select.append(this._placeholder.get());
    }
  }, {
    key: "_generateOptions",
    value: function _generateOptions() {
      var _this = this;

      if (this._config.autocomplete) {
        this._autocomplete = new _Element2["default"]("input", {
          "class": this._config.classNames.autocompleteInput,
          type: "text"
        });

        this._autocomplete.addEventListener("input", this._boundSortOptions);

        this._optionsWrapper.append(this._autocomplete.get());
      }

      return this._config.options.map(function (_option) {
        var option = new _Element2["default"]("div", {
          "class": "".concat(_this._config.classNames.option).concat(_option.disabled ? " " + _this._config.classNames.optionDisabled : ""),
          value: _option.value,
          textContent: _option.label,
          disabled: _option.disabled
        });

        if (_option.disabled) {
          _this._config.disabledOptions.push(String(_option.value));
        }

        _this._optionsWrapper.append(option.get());

        return option;
      });
    }
  }, {
    key: "_handleClick",
    value: function _handleClick(event) {
      event.stopPropagation();

      if (event.target.className === this._config.classNames.autocompleteInput) {
        return;
      }

      if (this._state.opened) {
        var option = this._options.find(function (_option) {
          return _option.get() === event.target;
        });

        if (option) {
          this._setValue(option.get().getAttribute("data-value"), true);
        }

        this._select.removeClass(this._config.classNames.dropdownShown);

        this._body.removeEventListener("click", this._boundHandleClick);

        this._select.addEventListener("click", this._boundHandleClick);

        this._state.opened = false;
        return;
      }

      if (event.target.className === this._config.icon) {
        return;
      }

      this._select.addClass(this._config.classNames.dropdownShown);

      this._body.addEventListener("click", this._boundHandleClick);

      this._select.removeEventListener("click", this._boundHandleClick);

      this._state.opened = true;

      if (this._autocomplete) {
        this._autocomplete.focus();
      }
    }
  }, {
    key: "_setValue",
    value: function _setValue(value, manual, unselected) {
      var _this2 = this;

      if (this._config.disabledOptions.indexOf(value) > -1) {
        return;
      }

      if (value && !unselected) {
        this._config.value = this._config.multiple ? [].concat(_toConsumableArray(this._config.value || []), [value]) : value;
      }

      if (value && unselected) {
        this._config.value = value;
      }

      this._options.forEach(function (_option) {
        _option.removeClass(_this2._config.classNames.selectedOption);
      });

      this._placeholder.removeClass(this._config.classNames.placeholderHidden);

      if (this._config.multiple) {
        var options = this._config.value.map(function (_value) {
          var option = _this2._config.options.find(function (_option) {
            return _option.value === _value;
          });

          var optionNode = _this2._options.find(function (_option) {
            return _option.get().getAttribute("data-value") === option.value.toString();
          });

          optionNode.addClass(_this2._config.classNames.selectedOption);
          return option;
        });

        if (options.length) {
          this._placeholder.addClass(this._config.classNames.placeholderHidden);
        }

        this._selectOptions(options, manual);

        return;
      }

      var option = this._config.value ? this._config.options.find(function (_option) {
        return _option.value.toString() === _this2._config.value;
      }) : this._config.options[0];

      var optionNode = this._options.find(function (_option) {
        return _option.get().getAttribute("data-value") === option.value.toString();
      });

      if (!this._config.value) {
        this._label.setText("");

        return;
      }

      optionNode.addClass(this._config.classNames.selectedOption);

      this._placeholder.addClass(this._config.classNames.placeholderHidden);

      this._selectOption(option, manual);
    }
  }, {
    key: "_selectOption",
    value: function _selectOption(option, manual) {
      this._selectedOption = option;

      this._label.setText(option.label);

      if (this._config.onChange && manual) {
        this._config.onChange(option.value);
      }
    }
  }, {
    key: "_selectOptions",
    value: function _selectOptions(options, manual) {
      var _this3 = this;

      this._label.setText("");

      this._icons = options.map(function (_option) {
        var selectedLabel = new _Element2["default"]("span", {
          "class": _this3._config.classNames.selectedLabel,
          textContent: _option.label
        });
        var icon = new _Element2["default"](_this3._config.inlineIcon ? _this3._config.inlineIcon.cloneNode(true) : "i", {
          "class": _this3._config.icon,
          value: _option.value
        });
        icon.addEventListener("click", _this3._boundUnselectOption);
        selectedLabel.append(icon.get());

        _this3._label.append(selectedLabel.get());

        return icon.get();
      });

      if (manual) {
        // eslint-disable-next-line no-magic-numbers
        this._optionsWrapper.setTop(Number(this._select.getHeight().split("px")[0]) + 5);
      }

      if (this._config.onChange && manual) {
        this._config.onChange(this._config.value);
      }
    }
  }, {
    key: "_unselectOption",
    value: function _unselectOption(event) {
      var newValue = _toConsumableArray(this._config.value);

      var index = newValue.indexOf(event.target.getAttribute("data-value")); // eslint-disable-next-line no-magic-numbers

      if (index !== -1) {
        newValue.splice(index, 1);
      }

      this._setValue(newValue, true, true);
    }
  }, {
    key: "_sortOptions",
    value: function _sortOptions(event) {
      var _this4 = this;

      this._options.forEach(function (_option) {
        if (!_option.get().textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").startsWith(event.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))) {
          _option.addClass(_this4._config.classNames.optionHidden);

          return;
        }

        _option.removeClass(_this4._config.classNames.optionHidden);
      });
    }
  }]);

  return SelectPure;
}();

exports["default"] = SelectPure;