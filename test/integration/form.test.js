"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const chaiHttp = require("chai-http");
const chai = require("chai");
chai.use(chaiHttp);
describe('Form test', function () {
    it("Route exist", async function () {
        chai.request(process.env.HTTP_TEST_LOCALHOST)
            .get(`${process.env.BASE_ROUTE}/form/example`)
            .end(function (err, res) {
            chai_1.expect(err).to.be.null;
            chai_1.expect(res).to.have.status(200);
        });
    });
    it("Reading from file works", function () {
        let formFromFile = require("../datamocks/forms/testForm.json");
        chai_1.expect("testForm" in sails.config.adminpanel.forms.data).to.be.true;
        chai_1.expect(sails.config.adminpanel.forms.data.testForm).to.equal(formFromFile);
    });
    it("Writing to file works", function () {
        chai.request(process.env.HTTP_TEST_LOCALHOST)
            .post(`${process.env.BASE_ROUTE}/form/testForm`)
            .send({ label: "Label123" })
            .end(function (err, res) {
            chai_1.expect(err).to.be.null;
            let formFromFile = require("../fixture/.tmp/adminpanel_file_storage.json");
            chai_1.expect(formFromFile['testForm'].label).to.equal("Label123");
        });
    });
    it("Seeding form data", function () {
        let VALUE = sails.config.adminpanel.forms.get("testForm", "test_seed_data");
        console.log(VALUE);
        chai_1.expect(VALUE).to.equal("VALUE");
    });
});
