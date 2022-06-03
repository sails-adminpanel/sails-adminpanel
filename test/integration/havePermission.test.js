"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
describe('Have permission test', function () {
    it("User with specific rights test", async function () {
        await GroupAP.destroy({ name: "Test Group" });
        await UserAP.destroy({ login: "test" });
        let group = await GroupAP.create({ name: "Test Group", description: "Group for test",
            tokens: [`read-users-instance`, `update-users-instance`] }).fetch();
        let user = await UserAP.create({ login: "test", fullName: "Test user", password: "test", groups: group.id }).fetch();
        // chai.request('http://localhost:1337')
        //     .post('/admin/userap/login')
        //     .type('form')
        //     .send({login: "test", password: "test"})
        //     .end(function (err, res) {
        //         expect(err).to.be.null;
        //         expect(res).to.have.status(200);
        //     })
        chai.request('http://localhost:1337')
            .get('/admin/users/add')
            .end(function (err, res) {
            (0, chai_1.expect)(err).to.be.null;
            console.log(res);
            (0, chai_1.expect)(res).to.have.status(403);
        });
    });
});
