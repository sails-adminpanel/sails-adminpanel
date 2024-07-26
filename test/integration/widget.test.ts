import "mocha";
import {expect} from "chai";
import CustomBase from '../../lib/widgets/abstractCustom';
import { LineAwesomeIcon } from "../../interfaces/lineAwesome";

class CustomOne extends CustomBase {
    public icon?: LineAwesomeIcon = "dog";
    constructor(ID) {
        super();
        this.ID = ID;
    }
    readonly ID: string;
    readonly department: string = 'test';
    readonly description: string = 'Widget Custom One';
    readonly name: string = 'Site Custom';
    readonly widgetType = 'custom';
    readonly backgroundCSS = '#da4fcf'
    readonly size = {
        h: 3,
        w: 2
    }

    public readonly  hideAdminPanelUI: boolean = true;
    public readonly scriptUrl: string = "/test.js";
    public readonly constructorName: string = "Test";
    public readonly constructorOption: any = {test: "/test.js"};
}


describe('Widget handler', function () {
    it('getWidgetHandler methods exists test"', function () {
        // getWidgetHandler: () => WidgetHandler, 
        // addDashboardWidget: WidgetHandler.add,
        expect( sails.hooks.adminpanel.getWidgetHandler ).to.exist;
    });

    it("Check if the method adds widgets", function () {
        let id = 'site_custom'

        let WidgetHandler = sails.hooks.adminpanel.getWidgetHandler()
        WidgetHandler.add( new CustomOne(id) )

        expect( WidgetHandler.getById(id) ).to.exist;
    })

});

