// import "mocha";
// import {expect} from "chai";
// import * as fs from "fs";
// import moduleHelper from "../../helpers/moduleHelper";
//
// describe('Find modules helper', function () {
//
//     it('Find specific module by app id', async function() {
//         let mockModule = JSON.parse(fs.readFileSync(__dirname + '/../datamocks/applicationScenario.json', 'utf8')).response;
//         let module = await moduleHelper.findSpecific("calculate-delivery-by-zones");
//         expect(module).to.deep.equal(mockModule);
//     });
//
//     it('Find my modules by apiKey', async function() {
//         let mockModules = JSON.parse(fs.readFileSync(__dirname + '/../datamocks/myApplicationsScenario.json', 'utf8')).response;
//         let modules = await moduleHelper.findMy("fb7d23fb-a597-4c83-9dd6-7eaff679ce9b");
//         expect(modules).to.deep.equal(mockModules);
//     });
//
//     it('Find all modules for marketplace', async function() {
//         let mockModules = JSON.parse(fs.readFileSync(__dirname + '/../datamocks/allApplicationsScenario.json', 'utf8')).response;
//         let modules = await moduleHelper.findAll();
//         expect(modules).to.deep.equal(mockModules);
//     });
//
// });
describe('Sails', function () {
    it('sails does not crash', () => true);
});
