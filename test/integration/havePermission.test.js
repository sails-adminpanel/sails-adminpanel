"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
describe('Have permission test', function () {
    it("User with specific rights test", async function () {
        let group = await GroupAP.create({ name: "Test Group", description: "Group for test",
            tokens: [`read-users-instance`, `update-users-instance`] }).fetch();
        let user = await UserAP.create({ login: "test", fullName: "Test user", password: "test", groups: group.id }).fetch();
        await GroupAP.destroy({ name: "Test Group" });
        await UserAP.destroy({ login: "test" });
    });
});
