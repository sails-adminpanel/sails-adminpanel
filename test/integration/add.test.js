"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { expect } = chai;
describe('Add Test Entity', function () {
    it("Should create and validate every field in Test entity", async function () {
        let testData = {
            title: "Test Title",
            title_2: "Test Title 2",
            test_ck5_1: "Test CK5",
            sort: true,
            sort_test: false,
            datatable: { key: "value" },
            image: { path: "image.png" },
            gallery: [{ path: "image1.png" }, { path: "image2.png" }],
            file: { name: "file.txt" },
            range: "10-20",
            json: { key: "value" },
            ace: { code: "function() {}" },
            datetime: "2022-01-01T12:00:00",
            date: "2022-01-01",
            time: "12:00:00",
            number: 42,
            color: "red",
            week: "2022-W01",
            schedule: { monday: "9-5" },
            select: "option1",
            geojson: { type: "Point", coordinates: ['10', '20'] }
        };
        let agent = chai.request.agent(sails.hooks.http.app);
        try {
            let res = await agent.post(`/admin/model/test/add`)
                .type('form')
                .send(testData);
            expect(res.status).to.equal(200);
            // Assuming that the ID of the newly created entity is in the response body.
            // @ts-ignore
            let createdTest = await Test.find({});
            if (createdTest.length !== 1)
                throw `expect one record`;
            for (let key in testData) {
                expect(createdTest[0][key]).to.deep.equal(testData[key]);
            }
            // Clean up the created entity
            // @ts-ignore
            await Test.destroy({ id: res.body.id });
        }
        catch (err) {
            console.error('An error has occurred:', err);
            throw err;
        }
    });
});
