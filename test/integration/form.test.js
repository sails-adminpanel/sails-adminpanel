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
        let formFromFile = require("../datamocks/forms/exampleFromFile.json");
        (0, chai_1.expect)("exampleFromFile" in sails.config.adminpanel.generator.forms).to.be.true;
        (0, chai_1.expect)(sails.config.adminpanel.generator.forms.exampleFromFile).to.equal(formFromFile);
    });
    it("Writing to file works", function () {
        chai.request(process.env.HTTP_TEST_LOCALHOST)
            .post(`${process.env.BASE_ROUTE}/form/exampleFromFile`)
            .send({ label: "Label123" })
            .end(function (err, res) {
            (0, chai_1.expect)(err).to.be.null;
            let formFromFile = require("../datamocks/forms/exampleFromFile.json");
            (0, chai_1.expect)(formFromFile.label.value).to.equal("Label123");
        });
    });
});