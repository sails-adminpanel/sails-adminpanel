"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataAccessor = void 0;
const adminUtil_1 = require("../adminUtil");
const configHelper_1 = require("../../helper/configHelper");
const accessRightsHelper_1 = require("../../helper/accessRightsHelper");
class DataAccessor {
    constructor(user, entity, action) {
        this.fields = null;
        this.user = user;
        this.entity = entity;
        this.action = action;
    }
    /**
     * Retrieves the fields for the given entity based on action type,
     * taking into account access rights and configuration settings.
     * @returns {Fields} An object with configured fields and their properties.
     */
    getFieldsConfig() {
        if (this.fields !== null) {
            return this.fields;
        }
        if (!this.entity.model || !this.entity.model.attributes) {
            return {};
        }
        // get action and field configs
        const actionConfig = adminUtil_1.AdminUtil.findActionConfig(this.entity, this.action);
        const fieldsConfig = this.entity.config.fields || {};
        const modelAttributes = this.entity.model.attributes;
        const result = {};
        Object.entries(modelAttributes).forEach(([key, modelField]) => {
            // Checks for short type in Waterline: fieldName: 'string'
            if (typeof modelField === "string") {
                modelField = { type: modelField };
            }
            // Set association type for a field
            if (modelField && typeof modelField === "object") {
                if (modelField.model) {
                    modelField.type = "association";
                }
                if (modelField.collection) {
                    modelField.type = "association-many";
                }
            }
            // Getting base field config
            let fldConfig = { key: key, title: key };
            /** Combine the field configuration from global and action-specific configs
             *  (now combine it before check, earlier was opposite).
             *  Action-specific config should overwrite the global one */
            // merge configs if they are both objects or pick priority one if not
            const combinedFieldConfig = typeof fieldsConfig[key] === "object" && typeof actionConfig.fields[key] === "object"
                ? { ...fieldsConfig[key], ...actionConfig.fields[key] }
                : actionConfig.fields[key] !== undefined
                    ? actionConfig.fields[key]
                    : fieldsConfig[key];
            if (combinedFieldConfig !== undefined) {
                /** Access rights check (check groupsAccessRights field if exists, if not - allow to all except default user group) */
                let hasAccess = this.checkFieldAccess(key, combinedFieldConfig);
                if (!hasAccess) {
                    return;
                }
                fldConfig = { ...fldConfig, ...configHelper_1.ConfigHelper.normalizeFieldConfig(combinedFieldConfig, key, modelField) };
            }
            // Populate associated fields configuration if field is an association
            let populatedModelFieldsConfig = {};
            if (modelField.type === "association" || modelField.type === "association-many") {
                const modelName = modelField.model || modelField.collection;
                if (modelName) {
                    const Model = adminUtil_1.AdminUtil.getModel(modelName);
                    if (Model) {
                        populatedModelFieldsConfig = this.getAssociatedFieldsConfig(modelName);
                    }
                    else {
                        adminizer.log.error(`Model not found: ${modelName}`);
                    }
                }
            }
            // Set required and type attributes
            fldConfig.required = Boolean(fldConfig.required || modelField.required);
            // Default type for field. Could be fetched form config file or file model if not defined in config file.
            fldConfig.type = (fldConfig.type || modelField.type).toLowerCase();
            // Normalize final configuration
            fldConfig = configHelper_1.ConfigHelper.normalizeFieldConfig(fldConfig, key, modelField);
            // Add new field to result set
            result[key] = { config: fldConfig, model: modelField, populated: populatedModelFieldsConfig };
        });
        this.fields = result;
        return result;
    }
    getAssociatedFieldsConfig(modelName) {
        const Model = adminUtil_1.AdminUtil.getModel(modelName);
        if (!Model || !adminizer.config.models[modelName] || typeof adminizer.config.models[modelName] === "boolean") {
            return undefined;
        }
        // Check if user has access to the associated model
        const actionVerb = getTokenAction(this.action);
        const tokenId = `${actionVerb}-${modelName}-${this.entity.type}`;
        if (!accessRightsHelper_1.AccessRightsHelper.havePermission(tokenId, this.user)) {
            adminizer.log.warn(`No access rights to ${this.entity.type}: ${modelName}`);
            return undefined;
        }
        const associatedFields = {};
        const modelConfig = adminizer.config.models[modelName];
        // Get the main fields configuration
        const fieldsConfig = modelConfig.fields || {};
        // Merge action-specific fields configuration if it exists
        let actionSpecificConfig = {};
        if (modelConfig && typeof modelConfig === "object" && typeof modelConfig['add'] !== "boolean" && typeof modelConfig['edit'] !== "boolean" && typeof modelConfig['list'] !== "boolean") {
            switch (this.action) {
                case "add":
                    actionSpecificConfig = modelConfig['add'].fields;
                    break;
                case "edit":
                    actionSpecificConfig = modelConfig['edit'].fields;
                    break;
                case "list":
                    actionSpecificConfig = modelConfig['list'].fields;
                    break;
                default:
                    throw `Action type error: unknown type [${this.action}]`;
            }
        }
        const mergedFieldsConfig = { ...fieldsConfig, ...actionSpecificConfig };
        // Loop through model attributes and apply access checks
        Object.entries(Model.attributes).forEach(([key, modelField]) => {
            const fieldConfig = mergedFieldsConfig[key];
            // Creating a basic config
            let fldConfig = { key: key, title: key };
            // If fieldConfig exists, normalize it and merge with the basic config
            if (fieldConfig) {
                const hasAccess = this.checkFieldAccess(key, fieldConfig);
                // Skip the field if access is denied
                if (!hasAccess)
                    return;
                fldConfig = { ...fldConfig, ...configHelper_1.ConfigHelper.normalizeFieldConfig(fieldConfig, key, modelField) };
            }
            // Add the field to associatedFields regardless of config presence
            associatedFields[key] = {
                config: fldConfig,
                model: modelField,
                populated: undefined, // set undefined for already populated fields
            };
        });
        return associatedFields;
    }
    checkFieldAccess(key, fieldConfig) {
        // If config is set to false skip this field
        if (fieldConfig === false) {
            return false;
        }
        if (this.entity.model.primaryKey === key) {
            return true;
        }
        if (this.user.isAdministrator) {
            return true;
        }
        if (typeof fieldConfig !== "object") {
            return true;
        }
        const userGroups = this.user.groups?.map((group) => group.name.toLowerCase());
        // Check if `groupsAccessRights` is set in the fieldConfig
        if (fieldConfig.groupsAccessRights) {
            const allowedGroups = fieldConfig.groupsAccessRights.map((item) => item.toLowerCase());
            return userGroups && userGroups.some(group => allowedGroups.includes(group));
        }
        else {
            // If no specific groups are allowed, deny access if the user is in "default user group"
            return !userGroups || !userGroups.includes(adminizer.config.registration?.defaultUserGroup);
        }
    }
    /**
     * Returns filtered record applying config from this.fields on this record
     * @data - record from a specific model */
    process(record) {
        // Initialize fields configuration, if it was not already set
        if (!this.fields) {
            this.fields = this.getFieldsConfig();
        }
        const filteredRecord = {};
        for (const fieldKey in record) {
            const fieldConfig = this.fields[fieldKey];
            const fieldValue = record[fieldKey];
            // Skip fields if they are not in the configuration
            if (!fieldConfig)
                continue;
            // Check access to the field
            if (this.checkFieldAccess(fieldKey, fieldConfig.config)) {
                const fieldConfigConfig = fieldConfig.config; // in this.fields configs are only objects
                const fieldType = fieldConfigConfig.type;
                // Handle fields that are not associations
                if (fieldType !== 'association' && fieldType !== 'association-many') {
                    filteredRecord[fieldKey] = fieldValue;
                }
                // Handle association-many
                else if (fieldType === 'association-many') {
                    if (Array.isArray(fieldValue)) {
                        // If the field value is an array of objects
                        filteredRecord[fieldKey] = fieldValue.every(item => typeof item === 'object')
                            ? fieldValue.map(associatedRecord => this.filterAssociatedRecord(associatedRecord, fieldConfig.populated))
                            : fieldValue; // If the array contains IDs, pass them as is (it can contain ids, because this function also can be called before saving something)
                    }
                    else {
                        // If fieldValue is not an array, log an error
                        adminizer.log.error(`Expected array for association-many field: ${fieldConfig.model.model}.${fieldKey}, but got:`, fieldValue);
                    }
                }
                // Handle single associations
                else if (fieldType === 'association') {
                    if (fieldValue && typeof fieldValue === 'object') {
                        // If the field value is an object
                        filteredRecord[fieldKey] = this.filterAssociatedRecord(fieldValue, fieldConfig.populated);
                    }
                    else {
                        // If the field value is an ID or null, pass it as is (it can contain id, because this function also can be called before saving something)
                        filteredRecord[fieldKey] = fieldValue;
                    }
                }
                // Handle cases where the field value is null or undefined
                else if (fieldValue === undefined || fieldValue === null) {
                    filteredRecord[fieldKey] = null;
                }
                // Log an error for unexpected scenarios
                else {
                    adminizer.log.error(`Unexpected field configuration or value for: ${fieldConfig.model.model}.${fieldKey}`);
                }
            }
        }
        return filteredRecord;
    }
    /** Filters associated records (simplified process() function) */
    filterAssociatedRecord(associatedRecord, associatedFieldsConfig) {
        if (!associatedFieldsConfig) {
            return {};
        }
        const filteredAssociatedRecord = {};
        for (const assocFieldKey in associatedRecord) {
            const assocFieldConfig = associatedFieldsConfig[assocFieldKey];
            const assocFieldValue = associatedRecord[assocFieldKey];
            if (assocFieldConfig && this.checkFieldAccess(assocFieldKey, assocFieldConfig.config)) {
                filteredAssociatedRecord[assocFieldKey] = assocFieldValue;
            }
        }
        return filteredAssociatedRecord;
    }
    /** Process for an array of records */
    processMany(records) {
        return records.map(record => this.process(record));
    }
    async sanitizeUserRelationAccess(criteria) {
        // Retrieve model configuration from Sails adminpanel config
        const modelName = this.entity.model.modelname;
        const modelConfig = this.entity.config;
        // Check if the model has `userAccessRelation` configured
        if (!this.user.isAdministrator && modelConfig && modelConfig.userAccessRelation) {
            // Get access field from userAccessRelation
            const userAccessRelation = modelConfig.userAccessRelation;
            if (typeof userAccessRelation === 'string') {
                let accessField = userAccessRelation;
                // Check if the relation points to `UserAP` or `GroupAP` in the model's attributes
                const modelAttributes = this.entity.model.attributes;
                const relation = modelAttributes[accessField];
                if (!relation || !['userap', 'groupap'].includes(relation.model.toLowerCase() || relation.collection.toLowerCase())) {
                    throw new Error(`Invalid userAccessRelation configuration for model ${modelName}`);
                }
                // Determine if the current user matches the access criteria
                if (relation.model) {
                    if (relation.model.toLowerCase() === 'userap') {
                        // Filter by the user's ID if related to UserAP as a model
                        criteria[accessField] = this.user.id;
                    }
                    else if (relation.model.toLowerCase() === 'groupap') {
                        // Filter by user's group membership if related to GroupAP as a model
                        const userGroups = this.user.groups?.map((group) => group.id);
                        criteria[accessField] = { in: userGroups };
                    }
                }
                /** Warning: code was not tested, need further processing in waterline (intersects does not support in waterline) */
                if (relation.collection) {
                    adminizer.log.warn(`Collection relation is not supported and was not tested. You may have an error here: ${JSON.stringify(relation, null, 2)}`);
                    if (relation.collection.toLowerCase() === 'userap') {
                        // Ensure user's ID is part of the associated collection to UserAP
                        criteria[accessField] = { contains: this.user.id };
                    }
                    else if (relation.collection.toLowerCase() === 'groupap') {
                        // Ensure user's groups intersect with the collection to GroupAP
                        const userGroups = this.user.groups?.map((group) => group.id);
                        criteria[accessField] = { intersects: userGroups };
                    }
                }
            }
            else if (typeof userAccessRelation === 'object' && userAccessRelation !== null) {
                // If userAccessRelation is an object
                const { field, via } = userAccessRelation;
                // Get attributes of the current model and validate the intermediate relation
                const modelAttributes = this.entity.model.attributes;
                const intermediateRelation = modelAttributes[field];
                if (!intermediateRelation || !intermediateRelation.model) {
                    throw new Error(`Invalid intermediate relation configuration for field "${field}" in model ${modelName}`);
                }
                // Retrieve the intermediate model
                const intermediateModel = sails.models[intermediateRelation.model.toLowerCase()];
                if (!intermediateModel) {
                    throw new Error(`Intermediate model "${intermediateRelation.model}" not found`);
                }
                // Validate the `via` field in the intermediate model
                const intermediateAttributes = intermediateModel.attributes;
                const viaRelation = intermediateAttributes[via];
                if (!viaRelation || viaRelation.model.toLowerCase() !== 'userap') {
                    throw new Error(`Unsupported or invalid via field "${via}" in intermediate model "${intermediateRelation.model}". ` +
                        `Currently, only relations to "userap" are supported`);
                }
                // Fetch the intermediate record associated with the user
                const intermediateRecord = await intermediateModel.findOne({ [via]: this.user.id });
                if (!intermediateRecord) {
                    throw new Error(`No intermediate record found in model "${intermediateRelation.model}" associated with user ID "${this.user.id}"`);
                }
                // Ensure there is only one associated intermediate record
                const intermediateRecordCount = await intermediateModel.count({ [via]: this.user.id });
                if (intermediateRecordCount > 1) {
                    throw new Error(`Multiple intermediate records found in model "${intermediateRelation.model}" associated with user ID "${this.user.id}". ` +
                        `Expected only one`);
                }
                // Add the intermediate record ID to the criteria
                if (criteria.where && typeof criteria.where !== "undefined") {
                    criteria.where[field] = intermediateRecord.id;
                }
                else {
                    criteria[field] = intermediateRecord.id;
                }
            }
        }
        return criteria;
    }
    async setUserRelationAccess(record) {
        // Check if model has `userAccessRelation` configured
        if (this.entity.config && this.entity.config.userAccessRelation) {
            // Get access field from userAccessRelation
            const userAccessRelation = this.entity.config.userAccessRelation;
            if (typeof userAccessRelation === 'string') {
                let accessField = userAccessRelation;
                // only admin can set user access relation manually
                if (record[accessField] && !this.user.isAdministrator) {
                    delete record[accessField];
                }
                // Check if the relation points to `UserAP` or `GroupAP` in the model's attributes
                const modelAttributes = this.entity.model.attributes;
                const relation = modelAttributes[accessField];
                if (relation && ['userap', 'groupap'].includes(relation.model.toLowerCase())) {
                    if (relation.model.toLowerCase() === 'userap') {
                        record[accessField] = this.user.id;
                    }
                    else if (relation.model.toLowerCase() === 'groupap') {
                        // Works only for users with only one group, later it can be resolved with group weight
                        const userGroups = this.user.groups || [];
                        if (userGroups.length === 1) {
                            record[accessField] = userGroups[0].id;
                        }
                        else {
                            throw new Error('Record cannot be saved because the user is associated with none or multiple groups.');
                        }
                    }
                }
            }
            else if (typeof userAccessRelation === 'object' && userAccessRelation !== null) {
                // If userAccessRelation is an object
                const { field, via } = userAccessRelation;
                // only admin can set user access relation manually
                if (record[field] && !this.user.isAdministrator) {
                    delete record[field];
                }
                // Get attributes of the current model and validate the intermediate relation
                const modelAttributes = this.entity.model.attributes;
                const intermediateRelation = modelAttributes[field];
                if (!intermediateRelation || !intermediateRelation.model) {
                    throw new Error(`Invalid intermediate relation configuration for field "${field}" in model ${this.entity.model.modelname}`);
                }
                // Retrieve the intermediate model
                const intermediateModel = sails.models[intermediateRelation.model.toLowerCase()];
                if (!intermediateModel) {
                    throw new Error(`Intermediate model "${intermediateRelation.model}" not found`);
                }
                // Validate the `via` field in the intermediate model
                const intermediateAttributes = intermediateModel.attributes;
                const viaRelation = intermediateAttributes[via];
                if (!viaRelation || viaRelation.model.toLowerCase() !== 'userap') {
                    throw new Error(`Unsupported or invalid via field "${via}" in intermediate model "${intermediateRelation.model}". ` +
                        `Currently, only relations to "userap" are supported`);
                }
                // Find an existing intermediate record linking the user to the main record
                const intermediateRecord = await intermediateModel.findOne({ [via]: this.user.id });
                if (!intermediateRecord) {
                    throw new Error(`No intermediate record found in model "${intermediateRelation.model}" linking user "${this.user.id}" to the main record`);
                }
                // Ensure there is only one associated intermediate record
                const intermediateRecordCount = await intermediateModel.count({ [via]: this.user.id });
                if (intermediateRecordCount > 1) {
                    throw new Error(`Multiple intermediate records found in model "${intermediateRelation.model}" associated with user ID "${this.user.id}". ` +
                        `Expected only one`);
                }
                // Set the ID of the intermediate record to the main record's field
                record[field] = intermediateRecord.id;
            }
        }
        return record;
    }
}
exports.DataAccessor = DataAccessor;
function getTokenAction(apAction) {
    switch (apAction) {
        case "add":
            return "create";
        case "list":
        case "view":
            return "read";
        case "edit":
            return "update";
        case "remove":
            return "delete";
    }
}
