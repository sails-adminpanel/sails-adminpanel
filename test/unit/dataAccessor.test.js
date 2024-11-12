"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const DataAccessor_1 = require("../../lib/v4/DataAccessor");
let entityMock = require("../datamocks/entityMock");
// TODO expand test and check also about populated fields
describe('getFieldsConfig - additional cases', () => {
    let adminUser, editorUser, managerUser, defaultUser;
    let entity, instance;
    beforeEach(() => {
        // Create mock users with different group permissions
        adminUser = { groups: [{ name: "admin" }] };
        editorUser = { groups: [{ name: "editor" }] };
        managerUser = { groups: [{ name: "manager" }] };
        defaultUser = { groups: [{ name: "default user group" }] };
        // Make a deep copy of the Entity for each test
        entity = JSON.parse(JSON.stringify(entityMock));
    });
    it('`guardedField` should only be accessible for admin and editor in `add` action', () => {
        instance = new DataAccessor_1.DataAccessor(adminUser, entity, 'add');
        const resultForAdmin = instance.getFieldsConfig();
        (0, chai_1.expect)(resultForAdmin).to.have.property('guardedField');
        instance = new DataAccessor_1.DataAccessor(editorUser, entity, 'add');
        const resultForEditor = instance.getFieldsConfig();
        (0, chai_1.expect)(resultForEditor).to.have.property('guardedField');
        instance = new DataAccessor_1.DataAccessor(managerUser, entity, 'add');
        const resultForManager = instance.getFieldsConfig();
        (0, chai_1.expect)(resultForManager).to.not.have.property('guardedField');
        instance = new DataAccessor_1.DataAccessor(defaultUser, entity, 'add');
        const resultForDefault = instance.getFieldsConfig();
        (0, chai_1.expect)(resultForDefault).to.not.have.property('guardedField');
    });
    it('`guardedField` should only be accessible for admin and manager in `edit` action', () => {
        instance = new DataAccessor_1.DataAccessor(adminUser, entity, 'edit');
        const resultForAdmin = instance.getFieldsConfig();
        (0, chai_1.expect)(resultForAdmin).to.have.property('guardedField');
        instance = new DataAccessor_1.DataAccessor(managerUser, entity, 'edit');
        const resultForManager = instance.getFieldsConfig();
        (0, chai_1.expect)(resultForManager).to.have.property('guardedField');
        instance = new DataAccessor_1.DataAccessor(editorUser, entity, 'edit');
        const resultForEditor = instance.getFieldsConfig();
        (0, chai_1.expect)(resultForEditor).to.not.have.property('guardedField');
        instance = new DataAccessor_1.DataAccessor(defaultUser, entity, 'edit');
        const resultForDefault = instance.getFieldsConfig();
        (0, chai_1.expect)(resultForDefault).to.not.have.property('guardedField');
    });
    it('`color` field should have type `color` in `edit` configuration', () => {
        instance = new DataAccessor_1.DataAccessor(adminUser, entity, 'edit');
        const result = instance.getFieldsConfig();
        (0, chai_1.expect)(result).to.have.property('color');
        (0, chai_1.expect)(result.color.config.type).to.equal('color');
    });
    it('Proper merging of global and action-specific field configurations', () => {
        // Here, we check the title field that has both a global and action-specific configuration
        instance = new DataAccessor_1.DataAccessor(adminUser, entity, 'edit');
        const result = instance.getFieldsConfig();
        (0, chai_1.expect)(result).to.have.property('title');
        (0, chai_1.expect)(result.title.config.title).to.equal('Title'); // from global config
        (0, chai_1.expect)(result.title.config.required).to.equal(true); // from action-specific config
    });
    it('Verify `title` field is ignored in `add` configuration', () => {
        instance = new DataAccessor_1.DataAccessor(adminUser, entity, 'add');
        const result = instance.getFieldsConfig();
        (0, chai_1.expect)(result).to.not.have.property('title'); // `title` should be ignored in `add`
    });
});
