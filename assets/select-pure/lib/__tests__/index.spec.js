"use strict";

var _index = require("../index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mockedClassNames = {
  select: "select",
  dropdownShown: "select-dropdownShown",
  multiselect: "select-multiselect",
  label: "select-label",
  placeholder: "select-placeholder",
  dropdown: "select-dropdown",
  option: "select-option",
  optionDisabled: "select-option__disabled",
  autocompleteInput: "select-autocomplete",
  selectedLabel: "select-selected-label",
  selectedOption: "select-selected-option",
  placeholderHidden: "select-placeholder",
  optionHidden: "select-option-hidden"
};
describe("SelectPure component", function () {
  afterEach(function () {
    document.body.innerHTML = "";
  });
  describe("basic", function () {
    it("renders select with options", function () {
      var div = document.createElement("div");
      div.classList.add("my-div");
      document.body.appendChild(div);
      new _index2["default"](".my-div", {
        options: [{
          label: "Ukraine",
          value: "UA",
          disabled: true
        }, {
          label: "Poland",
          value: "PL"
        }],
        classNames: mockedClassNames
      });
      expect(document.body.innerHTML).toMatchSnapshot();
    });
    it("renders select with disabled option", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      new _index2["default"](div, {
        options: [{
          label: "Poland",
          value: "PL",
          disabled: true
        }, {
          label: "Ukraine",
          value: "UA"
        }],
        classNames: mockedClassNames
      });
      expect(document.body.innerHTML).toMatchSnapshot();
    });
    it("toggles on click", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      new _index2["default"](div, {
        options: [{
          label: "Poland",
          value: "PL",
          disabled: true
        }, {
          label: "Ukraine",
          value: "UA"
        }],
        classNames: mockedClassNames
      });
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      expect(selectNode).toMatchSnapshot();
      selectNode.click();
      expect(selectNode).toMatchSnapshot();
      selectNode.click();
      expect(selectNode).toMatchSnapshot();
    });
    it("closes on outside element click", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      var targetSpan = document.createElement("span");
      document.body.appendChild(targetSpan);
      new _index2["default"](div, {
        options: [{
          label: "Poland",
          value: "PL",
          disabled: true
        }, {
          label: "Ukraine",
          value: "UA"
        }],
        classNames: mockedClassNames
      });
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      expect(selectNode).toMatchSnapshot();
      selectNode.click();
      expect(selectNode).toMatchSnapshot();
      targetSpan.click();
      expect(selectNode).toMatchSnapshot();
    });
    it("displays placeholder when value is not provided", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      new _index2["default"](div, {
        options: [{
          label: "Poland",
          value: "PL",
          disabled: true
        }, {
          label: "Ukraine",
          value: "UA"
        }],
        classNames: mockedClassNames,
        placeholder: "placeholder text"
      });
      expect(document.body.innerHTML).toMatchSnapshot();
    });
    it("sets option when value is provided", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      var select = new _index2["default"](div, {
        options: [{
          label: "Poland",
          value: "PL"
        }, {
          label: "Ukraine",
          value: "UA"
        }],
        value: "UA",
        classNames: mockedClassNames
      });
      expect(select.value()).toEqual("UA");
      expect(document.body.innerHTML).toMatchSnapshot();
    });
    it("selects another value", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      var select = new _index2["default"](div, {
        options: [{
          label: "Poland",
          value: "PL"
        }, {
          label: "Ukraine",
          value: "UA"
        }],
        value: "UA",
        classNames: mockedClassNames
      });
      expect(select.value()).toEqual("UA");
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      var options = document.querySelectorAll(".".concat(mockedClassNames.select, " .").concat(mockedClassNames.option));
      selectNode.click();
      options[0].click();
      expect(select.value()).toEqual("PL");
      expect(document.body.innerHTML).toMatchSnapshot();
    });
    it("doesn't select disabled option", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      var select = new _index2["default"](div, {
        options: [{
          label: "Poland",
          value: "PL",
          disabled: true
        }, {
          label: "Ukraine",
          value: "UA"
        }],
        value: "UA",
        classNames: mockedClassNames
      });
      expect(select.value()).toEqual("UA");
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      var options = document.querySelectorAll(".".concat(mockedClassNames.select, " .").concat(mockedClassNames.option));
      selectNode.click();
      options[0].click();
      expect(select.value()).toEqual("UA");
      expect(document.body.innerHTML).toMatchSnapshot();
    });
    it("calls onChange callback on click", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      var mockedOnChange = jest.fn();
      new _index2["default"](div, {
        options: [{
          label: "Poland",
          value: "PL"
        }, {
          label: "Ukraine",
          value: "UA"
        }],
        value: "UA",
        onChange: mockedOnChange,
        classNames: mockedClassNames
      });
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      var options = document.querySelectorAll(".".concat(mockedClassNames.select, " .").concat(mockedClassNames.option));
      expect(mockedOnChange.mock.calls.length).toBe(0);
      selectNode.click();
      expect(mockedOnChange.mock.calls.length).toBe(0);
      options[0].click();
      expect(mockedOnChange.mock.calls.length).toBe(1);
      expect(mockedOnChange.mock.calls[0][0]).toBe("PL");
    });
    it("sets position of dropdown according to the height of select", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      new _index2["default"](div, {
        options: [{
          label: "New York",
          value: "NY"
        }, {
          label: "Washington",
          value: "WA"
        }, {
          label: "California",
          value: "CA"
        }, {
          label: "New Jersey",
          value: "NJ"
        }, {
          label: "North Carolina",
          value: "NC"
        }],
        value: ["NY"],
        multiple: true,
        icon: "mocked-icon",
        classNames: mockedClassNames
      });
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      var options = document.querySelectorAll(".".concat(mockedClassNames.select, " .").concat(mockedClassNames.option));
      var dropdown = document.querySelector(".".concat(mockedClassNames.dropdown));
      selectNode.style.height = "24px";
      selectNode.click();
      expect(dropdown.style.top).toBe("");
      options[3].click();
      expect(window.getComputedStyle(dropdown).top).toBe("29px");
    });
    it("properly handles values as numbers", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);

      var method = function method() {
        return new _index2["default"](div, {
          options: [{
            label: "New York",
            value: 1
          }, {
            label: "Washington",
            value: 2
          }],
          classNames: mockedClassNames
        });
      };

      expect(method).not.toThrow();
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      selectNode.click();
      var options = document.querySelectorAll(".".concat(mockedClassNames.select, " .").concat(mockedClassNames.option));
      expect(function () {
        options[0].click();
      }).not.toThrow();
    });
    it("doesn't throw an error when options are empty", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      expect(function () {
        new _index2["default"](div, {
          options: []
        });
      }).not.toThrow();
    });
    it("resets selected value", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      var select = new _index2["default"](div, {
        options: [{
          label: "New York",
          value: "NY"
        }, {
          label: "Washington",
          value: "WA"
        }, {
          label: "California",
          value: "CA"
        }, {
          label: "New Jersey",
          value: "NJ"
        }, {
          label: "North Carolina",
          value: "NC"
        }],
        value: "NY",
        icon: "mocked-icon",
        classNames: mockedClassNames
      });
      expect(select.value()).toEqual("NY");
      select.reset();
      expect(select.value()).toEqual(null);
      expect(document.body.innerHTML).toMatchSnapshot();
    });
  });
  describe("multiselect", function () {
    it("calls onChange callback on click when multiple is true", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      var mockedOnChange = jest.fn();
      new _index2["default"](div, {
        options: [{
          label: "Poland",
          value: "PL"
        }, {
          label: "Ukraine",
          value: "UA"
        }],
        multiple: true,
        onChange: mockedOnChange,
        classNames: mockedClassNames
      });
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      var options = document.querySelectorAll(".".concat(mockedClassNames.select, " .").concat(mockedClassNames.option));
      expect(mockedOnChange.mock.calls.length).toBe(0);
      selectNode.click();
      expect(mockedOnChange.mock.calls.length).toBe(0);
      options[0].click();
      expect(mockedOnChange.mock.calls.length).toBe(1);
      expect(mockedOnChange.mock.calls[0][0]).toEqual(["PL"]);
    });
    it("doesn't select disabled option", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      var mockedOnChange = jest.fn();
      var select = new _index2["default"](div, {
        options: [{
          label: "Poland",
          value: "PL",
          disabled: true
        }, {
          label: "Ukraine",
          value: "UA"
        }],
        multiple: true,
        onChange: mockedOnChange,
        classNames: mockedClassNames
      });
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      var options = document.querySelectorAll(".".concat(mockedClassNames.select, " .").concat(mockedClassNames.option));
      expect(mockedOnChange.mock.calls.length).toBe(0);
      selectNode.click();
      expect(mockedOnChange.mock.calls.length).toBe(0);
      options[0].click();
      expect(mockedOnChange.mock.calls.length).toBe(0);
      expect(select.value()).toEqual();
    });
    it("properly renders", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      new _index2["default"](div, {
        options: [{
          label: "New York",
          value: "NY"
        }, {
          label: "Washington",
          value: "WA"
        }, {
          label: "California",
          value: "CA"
        }, {
          label: "New Jersey",
          value: "NJ"
        }, {
          label: "North Carolina",
          value: "NC"
        }],
        value: ["NY", "CA"],
        multiple: true,
        icon: "mocked-icon",
        classNames: mockedClassNames
      });
      expect(document.body.innerHTML).toMatchSnapshot();
    });
    it("selects new option on click", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      new _index2["default"](div, {
        options: [{
          label: "New York",
          value: "NY"
        }, {
          label: "Washington",
          value: "WA"
        }, {
          label: "California",
          value: "CA"
        }, {
          label: "New Jersey",
          value: "NJ"
        }, {
          label: "North Carolina",
          value: "NC"
        }],
        value: ["NY"],
        multiple: true,
        icon: "mocked-icon",
        classNames: mockedClassNames
      });
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      var options = document.querySelectorAll(".".concat(mockedClassNames.select, " .").concat(mockedClassNames.option));
      selectNode.click();
      options[4].click();
      expect(document.body.innerHTML).toMatchSnapshot();
    });
    it("unselects new option on icon click", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      new _index2["default"](div, {
        options: [{
          label: "New York",
          value: "NY"
        }, {
          label: "Washington",
          value: "WA"
        }, {
          label: "California",
          value: "CA"
        }, {
          label: "New Jersey",
          value: "NJ"
        }, {
          label: "North Carolina",
          value: "NC"
        }],
        value: ["NY"],
        multiple: true,
        icon: "mocked-icon",
        classNames: mockedClassNames
      });
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      var options = document.querySelectorAll(".".concat(mockedClassNames.select, " .").concat(mockedClassNames.option));
      selectNode.click();
      options[4].click();
      expect(document.body.innerHTML).toMatchSnapshot();
      var label = document.querySelector(".".concat(mockedClassNames.select, " .").concat(mockedClassNames.label));
      var selectedLabels = label.querySelectorAll(".".concat(mockedClassNames.selectedLabel));
      selectedLabels[0].querySelector("i").click();
      expect(document.body.innerHTML).toMatchSnapshot();
      selectedLabels[0].querySelector("i").click();
      expect(document.body.innerHTML).toMatchSnapshot();
    });
    it("properly renders with custom icon", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      var inlineIcon = document.createElement("img");
      inlineIcon.src = "/icon.svg";
      new _index2["default"](div, {
        options: [{
          label: "New York",
          value: "NY"
        }, {
          label: "Washington",
          value: "WA"
        }, {
          label: "California",
          value: "CA"
        }],
        value: ["NY", "CA"],
        multiple: true,
        inlineIcon: inlineIcon,
        classNames: mockedClassNames
      });
      expect(document.body.innerHTML).toMatchSnapshot();
    });
  });
  describe("autocomplete", function () {
    it("properly renders autocomplete select", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      new _index2["default"](div, {
        options: [{
          label: "New York",
          value: "NY"
        }, {
          label: "Washington",
          value: "WA"
        }, {
          label: "California",
          value: "CA"
        }, {
          label: "New Jersey",
          value: "NJ"
        }, {
          label: "North Carolina",
          value: "NC"
        }],
        value: ["NY", "CA"],
        multiple: true,
        autocomplete: true,
        icon: "mocked-icon",
        classNames: mockedClassNames
      });
      expect(document.body.innerHTML).toMatchSnapshot();
    });
    it("doesn't close dropdown on input click", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      new _index2["default"](div, {
        options: [{
          label: "New York",
          value: "NY"
        }, {
          label: "Washington",
          value: "WA"
        }, {
          label: "California",
          value: "CA"
        }, {
          label: "New Jersey",
          value: "NJ"
        }, {
          label: "North Carolina",
          value: "NC"
        }],
        value: ["NY", "CA"],
        multiple: true,
        autocomplete: true,
        icon: "mocked-icon",
        classNames: mockedClassNames
      });
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      var autocomplete = document.querySelector(".".concat(mockedClassNames.autocompleteInput));
      selectNode.click();
      expect(selectNode).toMatchSnapshot();
      autocomplete.click();
      expect(selectNode).toMatchSnapshot();
    });
    it("focuses autocomplete input on dropdown opening", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      new _index2["default"](div, {
        options: [{
          label: "New York",
          value: "NY"
        }, {
          label: "Washington",
          value: "WA"
        }, {
          label: "California",
          value: "CA"
        }, {
          label: "New Jersey",
          value: "NJ"
        }, {
          label: "North Carolina",
          value: "NC"
        }],
        value: ["NY", "CA"],
        multiple: true,
        autocomplete: true,
        icon: "mocked-icon",
        classNames: mockedClassNames
      });
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      var autocomplete = document.querySelector(".".concat(mockedClassNames.autocompleteInput));
      var options = document.querySelectorAll(".".concat(mockedClassNames.select, " .").concat(mockedClassNames.option));
      expect(document.activeElement).not.toEqual(autocomplete);
      selectNode.click();
      expect(document.activeElement).toEqual(autocomplete);
      options[1].click();
      selectNode.click();
      expect(document.activeElement).toEqual(autocomplete);
    });
    it("resets selected state", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      var select = new _index2["default"](div, {
        options: [{
          label: "New York",
          value: "NY"
        }, {
          label: "California",
          value: "CA"
        }, {
          label: "North Carolina",
          value: "NC"
        }],
        value: ["NY", "CA"],
        multiple: true,
        autocomplete: true,
        icon: "mocked-icon",
        classNames: mockedClassNames
      });
      expect(select.value()).toEqual(["NY", "CA"]);
      select.reset();
      expect(select.value()).toEqual([]);
      expect(document.body.innerHTML).toMatchSnapshot();
    });
    it("hides not matching options on input change", function () {
      var div = document.createElement("div");
      document.body.appendChild(div);
      new _index2["default"](div, {
        options: [{
          label: "New York",
          value: "NY"
        }, {
          label: "Washington",
          value: "WA"
        }, {
          label: "California",
          value: "CA"
        }, {
          label: "New Jersey",
          value: "NJ"
        }, {
          label: "North Carolina",
          value: "NC"
        }],
        value: ["NY", "CA"],
        multiple: true,
        autocomplete: true,
        icon: "mocked-icon",
        classNames: mockedClassNames
      });
      var selectNode = document.querySelector(".".concat(mockedClassNames.select));
      var autocomplete = document.querySelector(".".concat(mockedClassNames.autocompleteInput));
      selectNode.click();
      var event = new MouseEvent("input", {
        bubbles: true,
        cancelable: true
      });
      autocomplete.value = "new";
      autocomplete.dispatchEvent(event);
      expect(selectNode).toMatchSnapshot();
      autocomplete.value = "North";
      autocomplete.dispatchEvent(event);
      expect(selectNode).toMatchSnapshot();
    });
  });
});