"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const abstractCustom_1 = require("../../lib/widgets/abstractCustom");
class CustomOne extends abstractCustom_1.default {
    constructor(ID) {
        super();
        this.icon = "box";
        this.department = 'test';
        this.description = 'Widget Custom One';
        this.name = 'Site Custom';
        this.widgetType = 'custom';
        this.backgroundCSS = '#da4fcf';
        this.size = {
            h: 3,
            w: 2
        };
        this.hideAdminPanelUI = true;
        this.scriptUrl = "/test.js";
        this.constructorName = "Test";
        this.constructorOption = { test: "/test.js" };
        this.ID = ID;
    }
}
describe('Widget handler', function () {
    it('getWidgetHandler methods exists test"', function () {
        // getWidgetHandler: () => WidgetHandler, 
        // addDashboardWidget: WidgetHandler.add,
        (0, chai_1.expect)(sails.hooks.adminpanel.getWidgetHandler).to.exist;
    });
    it("Check if the method adds widgets", function () {
        let id = 'site_custom';
        let WidgetHandler = sails.hooks.adminpanel.getWidgetHandler();
        WidgetHandler.add(new CustomOne(id));
        (0, chai_1.expect)(WidgetHandler.getById(id)).to.exist;
    });
});
