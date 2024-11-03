"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { expect } = chai;
describe('Edit Test Entity', function () {
    //this.timeout(10000)
    it("Should create, update and save every field in Test entity", async function () {
        //await isLoadedRouter();
        let newTestData = {
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
        // @ts-ignore
        let newTest = await Test.create(newTestData).fetch();
        let updatedData = {
            title: "Updated Title",
            title_2: "Updated Title 2",
            test_ck5_1: "Updated CK5",
            sort: false,
            sort_test: true,
            datatable: { key: "newvalue" },
            image: { path: "newimage.png" },
            gallery: [{ path: "newimage1.png" }, { path: "newimage2.png" }],
            file: { name: "newfile.txt" },
            range: "20-30",
            json: { key: "newvalue" },
            ace: { code: "function() { return true; }" },
            datetime: "2022-02-01T12:00:00",
            date: "2022-02-01",
            time: "13:00:00",
            number: 43,
            color: "blue",
            week: "2022-W02",
            schedule: { monday: "10-6" },
            select: "option2",
            geojson: { type: "Point", coordinates: ['20', '30'] }
        };
        let agent = chai.request.agent(sails.hooks.http.app);
        try {
            let agent = chai.request.agent(sails.hooks.http.app);
            let res = await agent.post(`/admin/model/test/edit/${newTest.id}`)
                .type('form')
                .send(updatedData);
            // @ts-ignore
            let updatedTest = await Test.findOne({ id: newTest.id });
            for (let key in updatedData) {
                //@ts-ignore
                expect(updatedTest[key]).to.deep.equal(updatedData[key]);
            }
            // @ts-ignore
            await Test.destroy({ id: newTest.id });
        }
        catch (err) {
            console.error('An error has occurred:', err);
            throw err;
        }
    });
});
async function isLoadedRouter() {
    return new Promise((resolve, reject) => {
        sails.on("adminpanel:router:binded", resolve);
    });
}
