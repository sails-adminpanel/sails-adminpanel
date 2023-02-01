import "mocha";
import * as chai from "chai";
import chaiHttp = require('chai-http');
chai.use(chaiHttp);


describe('Have permission test', function () {
    it("User with specific rights test", async function() {
        await GroupAP.destroy({name: "Test Group"});
        await UserAP.destroy({login: "test"});

        let agent = chai.request.agent(sails.hooks.http.app);
        agent.post('/admin/model/userap/login')
            .type('form')
            .send({login: "test", password: "test"})
            .then(function(res){
                agent.get('/admin/users/add')
                    .then(function(res2){
                        res2.should.have.status(403);
                    });
            });
    })


})
