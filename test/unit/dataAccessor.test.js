"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
const chai_1 = require("chai");
const DataAccessor_1 = require("../../lib/v4/DataAccessor");
let entityMock = require("../datamocks/entityMock");
// TODO expand test and check another methods like sanitize
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
    it('`guardedField` in `populated` config for self-association', () => {
        instance = new DataAccessor_1.DataAccessor(adminUser, entity, 'edit');
        const result = instance.getFieldsConfig();
        (0, chai_1.expect)(result).to.have.property('selfAssociation');
        const populated = result.selfAssociation.populated;
        (0, chai_1.expect)(populated).to.be.an('object');
        (0, chai_1.expect)(populated).to.have.property('guardedField');
        instance = new DataAccessor_1.DataAccessor(defaultUser, entity, 'edit');
        const resultForDefault = instance.getFieldsConfig();
        const defaultPopulated = resultForDefault.selfAssociation.populated;
        (0, chai_1.expect)(defaultPopulated).to.be.undefined; // Default user does not have access
    });
    it('Association fields are populated correctly for `edit` action', () => {
        instance = new DataAccessor_1.DataAccessor(managerUser, entity, 'edit');
        const result = instance.getFieldsConfig();
        const associated = result.selfAssociation.populated;
        (0, chai_1.expect)(associated).to.be.an('object');
        (0, chai_1.expect)(associated).to.have.property('title'); // Fields from associated model
        (0, chai_1.expect)(associated).to.not.have.property('guardedField'); // No access for manager
    });
    it('Populated fields respect group access rights', () => {
        instance = new DataAccessor_1.DataAccessor(editorUser, entity, 'add');
        const result = instance.getFieldsConfig();
        const associated = result.selfAssociation.populated;
        (0, chai_1.expect)(associated).to.be.an('object');
        (0, chai_1.expect)(associated).to.have.property('guardedField'); // Access for editor
        (0, chai_1.expect)(associated.guardedField.config.title).to.equal('Restricted Field');
    });
    it('Populated fields handle missing associations gracefully', () => {
        instance = new DataAccessor_1.DataAccessor(adminUser, entity, 'edit');
        const result = instance.getFieldsConfig();
        const unrelated = result.unrelatedAssociation;
        (0, chai_1.expect)(unrelated).to.be.undefined; // Association missing
    });
});
