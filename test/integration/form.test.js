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
            (0, chai_1.expect)(err).to.be.null;
            (0, chai_1.expect)(res).to.have.status(200);
        });
    });
    it("Reading from file works", function () {
        let formFromFile = require("../datamocks/forms/testForm.json");
        (0, chai_1.expect)("testForm" in sails.config.adminpanel.forms.data).to.be.true;
        (0, chai_1.expect)(sails.config.adminpanel.forms.data.testForm).to.equal(formFromFile);
    });
    it("Writing to file works", function () {
        chai.request(process.env.HTTP_TEST_LOCALHOST)
            .post(`${process.env.BASE_ROUTE}/form/testForm`)
            .send({ label: "Label123", test_seed_json: { test: true } })
            .end(function (err, res) {
            (0, chai_1.expect)(err).to.be.null;
            let formFromFile = require("../fixture/.tmp/adminpanel_file_storage.json");
            (0, chai_1.expect)(formFromFile['testForm'].label).to.equal("Label123");
            (0, chai_1.expect)(formFromFile['testForm'].test_seed_json.test).to.equal(true);
        });
    });
    it("Seeding form data", async function () {
        let VALUE = await sails.config.adminpanel.forms.get("testForm", "test_seed_data");
        console.log(VALUE);
        (0, chai_1.expect)(VALUE).to.equal("VALUE");
    });
});
