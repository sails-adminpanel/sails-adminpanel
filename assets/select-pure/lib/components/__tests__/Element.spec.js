"use strict";

var _Element = require("../Element.js");

var _Element2 = _interopRequireDefault(_Element);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

describe("Element component", function () {
  var defaultAttributes = {
    value: "input_name",
    "class": "this_is_class",
    fakeAttribute: "fake fake"
  };
  var modifiedAttributes = {
    value: "another_input_name",
    "class": "this_is_class_for_sure"
  };
  test("creates input element", function () {
    var input = new _Element2["default"]("input", defaultAttributes).get();
    expect(input).toBeInstanceOf(HTMLElement);
    expect(input.tagName).toBe("INPUT");
    expect(input.getAttribute("data-value")).toBe("input_name");
    expect(input.getAttribute("class")).toBe("this_is_class");
    expect(input.getAttribute("fakeAttribute")).toBe(null);
  });
  test("creates textarea element", function () {
    var textarea = new _Element2["default"]("textarea", modifiedAttributes).get();
    expect(textarea).toBeInstanceOf(HTMLElement);
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea.getAttribute("data-value")).toBe("another_input_name");
    expect(textarea.getAttribute("class")).toBe("this_is_class_for_sure");
  });
  test("creates element from existing element", function () {
    var existing = document.createElement("span");
    existing.setAttribute("id", "some_id");
    var newElement = new _Element2["default"](existing, modifiedAttributes).get();
    expect(newElement).toBe(existing);
  });
  test("appends child", function () {
    var div = new _Element2["default"]("div");
    expect(div.get().childNodes.length).toBe(0);
    var span = document.createElement("span");
    var newDiv = div.append(span);
    expect(div.get().childNodes.length).toBe(1);
    expect(div.get().childNodes[0]).toBe(span);
    expect(newDiv).toBeInstanceOf(_Element2["default"]);
  });
  test("sets textContent", function () {
    var span = new _Element2["default"]("span", {
      textContent: "Hello, world!"
    }).get();
    expect(span.textContent).toBe("Hello, world!");
  });
  test("adds class", function () {
    var span = new _Element2["default"]("span");
    expect(span.get().classList.contains("new_class")).toBe(false);
    var newElement = span.addClass("new_class");
    expect(newElement).toBeInstanceOf(_Element2["default"]);
    expect(span.get().classList.contains("new_class")).toBe(true);
  });
  test("removes class", function () {
    var span = new _Element2["default"]("span");
    expect(span.get().classList.contains("new_class")).toBe(false);
    span.addClass("new_class");
    expect(span.get().classList.contains("new_class")).toBe(true);
    var newElement = span.removeClass("new_class");
    expect(newElement).toBeInstanceOf(_Element2["default"]);
    expect(span.get().classList.contains("new_class")).toBe(false);
  });
  test("toggles class", function () {
    var span = new _Element2["default"]("span");
    expect(span.get().classList.contains("new_class")).toBe(false);
    var toggled1 = span.toggleClass("new_class");
    expect(toggled1).toBeInstanceOf(_Element2["default"]);
    expect(span.get().classList.contains("new_class")).toBe(true);
    var toggled2 = span.toggleClass("new_class");
    expect(toggled2).toBeInstanceOf(_Element2["default"]);
    expect(span.get().classList.contains("new_class")).toBe(false);
  });
  test("adds event listener", function () {
    var span = new _Element2["default"]("span");
    var callback = jest.fn();
    span.addEventListener("click", callback);
    expect(callback.mock.calls.length).toBe(0);
    span.get().click();
    expect(callback.mock.calls.length).toBe(1);
  });
  test("removes event listener", function () {
    var span = new _Element2["default"]("span");
    var callback = jest.fn();
    span.addEventListener("click", callback);
    expect(callback.mock.calls.length).toBe(0);
    span.get().click();
    expect(callback.mock.calls.length).toBe(1);
    span.removeEventListener("click", callback);
    callback.mockClear();
    span.get().click();
    expect(callback.mock.calls.length).toBe(0);
  });
  test("sets text content", function () {
    var span = new _Element2["default"]("span");
    expect(span.get().textContent).toBe("");
    var newSpan = span.setText("mock text");
    expect(newSpan).toBeInstanceOf(_Element2["default"]);
    expect(span.get().textContent).toBe("mock text");
  });
  test("returns height", function () {
    var span = new _Element2["default"]("span");
    span.get().style.height = "29px";
    span.get().style.padding = "5px";
    var height = span.getHeight();
    expect(height).toBe("29px");
  });
  test("sets top", function () {
    var span = new _Element2["default"]("span");
    expect(span.get().style.top).toBe(""); // eslint-disable-next-line no-magic-numbers

    var newSpan = span.setTop(100);
    expect(newSpan).toBeInstanceOf(_Element2["default"]);
    expect(span.get().style.top).toBe("100px");
  });
  test("focuses", function () {
    var focusSpy = jest.fn();
    HTMLElement.prototype.focus = focusSpy;
    var input = new _Element2["default"]("input");
    expect(focusSpy).toHaveBeenCalledTimes(0);
    input.focus();
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});