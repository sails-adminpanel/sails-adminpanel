/**
 * The class manages the interaction between the user and the database entry, taking into account user permissions and the main config file settings.
 */
import {UserAPRecord} from "../../models/UserAP";
import {Entity} from "../../interfaces/types";
import {ActionType, ModelFieldConfig} from "../../interfaces/adminpanelConfig";
import {Field, Fields} from "../../helper/fieldsHelper";
import {AdminUtil} from "../adminUtil";
import {ConfigHelper} from "../../helper/configHelper";
import {GroupAPRecord} from "../../models/GroupAP";
import {AccessRightsHelper} from "../../helper/accessRightsHelper";
import {ModelAnyInstance} from "./model/AbstractModel";

export class DataAccessor {
  user: UserAPRecord;
  entity: Entity;
  action: ActionType
  fields: Fields = null;

  constructor(user: UserAPRecord, entity: Entity, action: ActionType) {
    this.user = user;
    this.entity = entity;
    this.action = action
  }

  /**
   * Retrieves the fields for the given entity based on action type,
   * taking into account access rights and configuration settings.
   * @returns {Fields} An object with configured fields and their properties.
   */
  public getFieldsConfig(): Fields {
    if (!this.entity.model || !this.entity.model.attributes) {
      return {};
    }

    // get action and field configs
    const actionConfig = AdminUtil.findActionConfig(this.entity, this.action);
    const fieldsConfig = this.entity.config.fields || {};
    const modelAttributes = this.entity.model.attributes;

    const result: Fields = {};

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

      // Ignore identifier field for add action
      if (this.action === "add" && key === sails.config.adminpanel.identifierField) {
        return;
      }

      // Getting base field config
      let fldConfig: Field["config"] = { key: key, title: key };
      let ignoreField = false; // if set to true, field will be removed from editor/list

      /** Combine the field configuration from global and action-specific configs
       *  (now combine it before check, earlier was opposite).
       *  Action-specific config should overwrite the global one */
      // merge configs if they are both objects or pick priority one if not
      const combinedFieldConfig =
        typeof fieldsConfig[key] === "object" && typeof actionConfig.fields[key] === "object"
          ? { ...fieldsConfig[key], ...actionConfig.fields[key] }
          : actionConfig.fields[key] !== undefined
            ? actionConfig.fields[key]
            : fieldsConfig[key];

      if (combinedFieldConfig !== undefined) {
        if (combinedFieldConfig === false) {
          // if config is set to false ignore this field
          ignoreField = true;
        } else {
          if (typeof combinedFieldConfig === "object") {
            /** Access rights check (check groupsAccessRights field if exists, if not - allow to all except default user group) */
            ignoreField = !this.checkFieldAccess(combinedFieldConfig);
          }

          fldConfig = { ...fldConfig, ...ConfigHelper.normalizeFieldConfig(combinedFieldConfig, key, modelField) };
        }
      }

      if (ignoreField) {
        return;
      }

      // Populate associated fields configuration if field is an association
      let populatedModelFieldsConfig = {};
      if (modelField.type === "association" || modelField.type === "association-many") {
        const modelName = modelField.model || modelField.collection;
        if (modelName) {
          const Model = AdminUtil.getModel(modelName as keyof Models);
          if (Model) {
            populatedModelFieldsConfig = this.getAssociatedFieldsConfig(modelName);
          } else {
            sails.log.error(`Model not found: ${modelName}`);
          }
        }
      }

      // Set required and type attributes
      fldConfig.required = Boolean(fldConfig.required || modelField.required);
      // Default type for field. Could be fetched form config file or file model if not defined in config file.
      fldConfig.type = (fldConfig.type || modelField.type).toLowerCase();

      // Normalize final configuration
      fldConfig = ConfigHelper.normalizeFieldConfig(fldConfig, key, modelField);

      // Add new field to result set
      result[key] = { config: fldConfig, model: modelField, populated: populatedModelFieldsConfig };
    });

    this.fields = result;
    return result;
  }

  private getAssociatedFieldsConfig(modelName: string): { [fieldName: string]: Field } | undefined {
    const Model = AdminUtil.getModel(modelName as keyof Models);
    if (!Model || !sails.config.adminpanel.models[modelName] || typeof sails.config.adminpanel.models[modelName] === "boolean") {
      return undefined;
    }

    // Check if user has access to the associated model
    const actionVerb = getTokenAction(this.action);
    const tokenId = `${actionVerb}-${modelName}-${this.entity.type}`;
    if (!AccessRightsHelper.havePermission(tokenId, this.user)) {
      sails.log.warn(`No access rights to ${this.entity.type}: ${modelName}`);
      return undefined;
    }

    const associatedFields: { [fieldName: string]: Field } = {};
    const modelConfig = sails.config.adminpanel.models[modelName];

    // Get the main fields configuration
    const fieldsConfig = modelConfig.fields || {};

    // Merge action-specific fields configuration if it exists
    let actionSpecificConfig = {};
    if (modelConfig[this.action] && typeof modelConfig[this.action] !== "boolean") {
      actionSpecificConfig = modelConfig[this.action].fields;
    }
    const mergedFieldsConfig = { ...fieldsConfig, ...actionSpecificConfig };

    // Loop through model attributes and apply access checks
    Object.entries(Model.attributes).forEach(([key, modelField]) => {
      const fieldConfig = mergedFieldsConfig[key];

      // If config is set to false skip this field
      if (fieldConfig === false) return;

      // Creating a basic config
      let fldConfig: Field["config"] = { key: key, title: key };

      // If fieldConfig exists, normalize it and merge with the basic config
      if (fieldConfig && typeof fieldConfig === "object") {
        const hasAccess = this.checkFieldAccess(fieldConfig);

        // Skip the field if access is denied
        if (!hasAccess) return;
        fldConfig = { ...fldConfig, ...ConfigHelper.normalizeFieldConfig(fieldConfig, key, modelField) };
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

  private checkFieldAccess(fieldConfig: ModelFieldConfig): boolean {
    if (this.user.isAdministrator) {
      return true;
    }

    const userGroups = this.user.groups?.map((group: GroupAPRecord) => group.name.toLowerCase());

    // Check if `groupsAccessRights` is set in the fieldConfig
    if (fieldConfig.groupsAccessRights) {
      const allowedGroups = fieldConfig.groupsAccessRights.map((item: string) => item.toLowerCase());
      return userGroups && userGroups.some(group => allowedGroups.includes(group));
    } else {
      // If no specific groups are allowed, deny access if the user is in "default user group"
      return !userGroups || !userGroups.includes("default user group");
    }
  }

  /**
   * Returns filtered record applying config from this.fields on this record
   * @data - record from a specific model */
  public process<T>(record: T): Partial<T> {
    // Initialize fields configuration, if it was not already set
    if (!this.fields) {
      this.fields = this.getFieldsConfig();
    }

    const filteredRecord: Partial<T> = {};
    for (const fieldKey in record) {
      const fieldConfig = this.fields[fieldKey];
      const fieldValue = record[fieldKey];

      // Skip fields if it is not in config
      if (!fieldConfig) continue;

      // Check access to field
      if (this.checkFieldAccess(fieldConfig.config)) {
        // if field type is not association, add field to filteredRecord
        if (fieldConfig.config.type !== 'association' && fieldConfig.config.type !== 'association-many') {
          filteredRecord[fieldKey] = fieldValue;
        } else if (fieldConfig.config.type === 'association-many' && Array.isArray(fieldValue)) {
          // process association-many
          filteredRecord[fieldKey] = fieldValue.map(associatedRecord =>
            this.filterAssociatedRecord(associatedRecord, fieldConfig.populated)
          );
        } else if (fieldConfig.config.type === 'association' && fieldValue && typeof fieldValue === 'object') {
          // process single association
          filteredRecord[fieldKey] = this.filterAssociatedRecord(fieldValue, fieldConfig.populated);
        } else if (fieldValue === undefined || fieldValue === null) {
          filteredRecord[fieldKey] = null;
        } else {
          sails.log.error(`Error trying to check access to field: ${fieldConfig.model.model}.${fieldKey}`)
        }
      }
    }

    return filteredRecord;
  }

  /** Filters associated records (simplified process() function) */
  private filterAssociatedRecord<T>(associatedRecord: T, associatedFieldsConfig: { [fieldName: string]: Field }): Partial<T> {
    if (!associatedFieldsConfig) {
      return {}
    }

    const filteredAssociatedRecord: Partial<T> = {};
    for (const assocFieldKey in associatedRecord) {
      const assocFieldConfig = associatedFieldsConfig[assocFieldKey];
      const assocFieldValue = associatedRecord[assocFieldKey];

      if (assocFieldConfig && this.checkFieldAccess(assocFieldConfig.config)) {
        filteredAssociatedRecord[assocFieldKey] = assocFieldValue;
      }
    }

    return filteredAssociatedRecord;
  }

  /** Process for an array of records */
  public processMany<T>(records: T[]): Partial<T>[] {
    return records.map(record => this.process(record));
  }

  public sanitizeUserRelationAccess<T>(criteria: T): Partial<T> {
    // Retrieve model configuration from Sails adminpanel config
    const modelName = this.entity.model.modelname;
    const modelConfig = this.entity.config;

    // Check if the model has `userAccessRelation` configured
    if (!this.user.isAdministrator && modelConfig && modelConfig.userAccessRelation) {
      // Get access field from userAccessRelation
      const accessField = modelConfig.userAccessRelation;

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
        } else if (relation.model.toLowerCase() === 'groupap') {
          // Filter by user's group membership if related to GroupAP as a model
          const userGroups = this.user.groups?.map((group: GroupAPRecord) => group.id);
          criteria[accessField] = { in: userGroups };
        }
      }

      /** Warning: code was not tested, need further processing in waterline (intersects does not support in waterline) */
      if (relation.collection) {
        sails.log.warn(`Collection relation is not supported and was not tested. You may have an error here: ${JSON.stringify(relation, null, 2)}`)
        if (relation.collection.toLowerCase() === 'userap') {
          // Ensure user's ID is part of the associated collection to UserAP
          criteria[accessField] = { contains: this.user.id };
        } else if (relation.collection.toLowerCase() === 'groupap') {
          // Ensure user's groups intersect with the collection to GroupAP
          const userGroups = this.user.groups?.map((group: GroupAPRecord) => group.id);
          criteria[accessField] = { intersects: userGroups };
        }
      }
    }

    return criteria;
  }
}


function getTokenAction(apAction: ActionType) {
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
