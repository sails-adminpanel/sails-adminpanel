import "mocha";
import {expect} from "chai";

describe('Models test', function () {
    it("Check User-Group association", async function() {
        let groups = await GroupAP.createEach([{name: "group1"}, {name: "group2"}]).fetch();
        let users = await UserAP.createEach([{fullName: "user1", login: "1", password: "1"}, {fullName: "user2", login: "2", password: "1"}]).fetch();
        // @ts-ignore
        await GroupAP.addToCollection(groups[0].id, "users").members([users[0].id, users[1].id]);
        // @ts-ignore
        await GroupAP.addToCollection(groups[1].id, "users").members([users[0].id, users[1].id]);
        let user = await UserAP.findOne({id: users[0].id}).populate("groups");
        expect(user.groups.length).to.equal(2);
    })
})
