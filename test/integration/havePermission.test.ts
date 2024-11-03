import "mocha";
import * as chai from "chai";
import chaiHttp = require('chai-http');
import {expect} from "chai";

chai.use(chaiHttp);

// TODO
// The test does not pass. The rights access testing system should be refactored and rewritten
describe('Have permission test(TODO)', function () {
	it("User with specific rights (TODO)", async function () {
	// 	await GroupAP.destroy({name: "Test Group"});
	// 	await UserAP.destroy({login: "test"});
	//
	// 	let agent = chai.request.agent(sails.hooks.http.app);
	// 	await agent.post('/admin/model/userap/login')
	// 		.type('form')
	// 		.send({login: "test", password: "test"})
	// 	const res2 = await agent.get('/admin/model/usersap/add')
	//
	// 	expect(res2.status).to.equal(403);
	})
})
