import "mocha";
import {expect} from "chai";
import chaiHttp = require('chai-http');
import * as chai from "chai";
chai.use(chaiHttp);

describe('Form test', function () {
    it("Route exist", async function() {
        chai.request(process.env.HTTP_TEST_LOCALHOST)
            .get(`${process.env.BASE_ROUTE}/form/example`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
            })
    })

    it("Reading from file works", function () {
        let formFromFile = require("../datamocks/forms/exampleFromFile.json");
        expect("exampleFromFile" in sails.config.adminpanel.forms.data).to.be.true;
        expect(sails.config.adminpanel.forms.data.exampleFromFile).to.equal(formFromFile);
    })

    it("Writing to file works", function () {
        chai.request(process.env.HTTP_TEST_LOCALHOST)
            .post(`${process.env.BASE_ROUTE}/form/exampleFromFile`)
            .send({label: "Label123"})
            .end(function (err, res) {
                expect(err).to.be.null;
                let formFromFile = require("../datamocks/forms/exampleFromFile.json");
                expect(formFromFile.label.value).to.equal("Label123")
            })
    })
})
