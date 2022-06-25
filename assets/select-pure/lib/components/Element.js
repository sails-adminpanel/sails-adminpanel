"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var allowedAttributes = {
  value: "data-value",
  disabled: "data-disabled",
  "class": "class",
  type: "type"
};

var Element = /*#__PURE__*/function () {
  function Element(element) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var i18n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, Element);

    this._node = element instanceof HTMLElement ? element : document.createElement(element);
    this._config = {
      i18n: i18n
    };

    this._setAttributes(attributes);

    if (attributes.textContent) {
      this._setTextContent(attributes.textContent);
    }

    return this;
  }

  _createClass(Element, [{
    key: "get",
    value: function get() {
      return this._node;
    }
  }, {
    key: "append",
    value: function append(element) {
      this._node.appendChild(element);

      return this;
    }
  }, {
    key: "addClass",
    value: function addClass(className) {
      this._node.classList.add(className);

      return this;
    }
  }, {
    key: "removeClass",
    value: function removeClass(className) {
      this._node.classList.remove(className);

      return this;
    }
  }, {
    key: "toggleClass",
    value: function toggleClass(className) {
      this._node.classList.toggle(className);

      return this;
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(type, callback) {
      this._node.addEventListener(type, callback);

      return this;
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, callback) {
      this._node.removeEventListener(type, callback);

      return this;
    }
  }, {
    key: "setText",
    value: function setText(text) {
      this._setTextContent(text);

      return this;
    }
  }, {
    key: "getHeight",
    value: function getHeight() {
      return window.getComputedStyle(this._node).height;
    }
  }, {
    key: "setTop",
    value: function setTop(top) {
      this._node.style.top = "".concat(top, "px");
      return this;
    }
  }, {
    key: "focus",
    value: function focus() {
      this._node.focus();

      return this;
    }
  }, {
    key: "_setTextContent",
    value: function _setTextContent(textContent) {
      this._node.textContent = textContent;
    }
  }, {
    key: "_setAttributes",
    value: function _setAttributes(attributes) {
      for (var key in attributes) {
        if (allowedAttributes[key] && attributes[key]) {
          this._setAttribute(allowedAttributes[key], attributes[key]);
        }
      }
    }
  }, {
    key: "_setAttribute",
    value: function _setAttribute(key, value) {
      this._node.setAttribute(key, value);
    }
  }]);

  return Element;
}();

exports["default"] = Element;