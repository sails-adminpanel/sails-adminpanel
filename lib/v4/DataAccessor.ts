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
      let fldConfig: any = { key: key, title: key };
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

      // Access control: check if field access is allowed based on groupsAccessRights
      if (combinedFieldConfig !== undefined) {
        if (combinedFieldConfig === false) {
          // if config is set to false ignore this field
          ignoreField = true;
        } else {
          if (typeof combinedFieldConfig === "object") {
            /** Access rights check (check groupsAccessRights field if exists, if not - allow to all except default user group) */
            if (combinedFieldConfig.groupsAccessRights) {
              // start checking access rights to the field (has 'groupsAccessRights' flag)
              const allowedGroups = combinedFieldConfig.groupsAccessRights.map(item => item.toLowerCase());
              const userGroups = this.user.groups.map((group: GroupAPRecord) => group.name.toLowerCase());
              ignoreField = !userGroups.some(group => allowedGroups.includes(group));
            } else {
              // Deny access to "default user group" if no access rights are specified
              ignoreField = this.user.groups.some((group: GroupAPRecord) => group.name.toLowerCase() === "default user group");
            }
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

      if (!fieldConfig || typeof fieldConfig !== "object") return;

      const hasAccess = this.checkFieldAccess(fieldConfig);
      if (hasAccess) {
        associatedFields[key] = {
          config: ConfigHelper.normalizeFieldConfig(fieldConfig, key, modelField),
          model: modelField,
          populated: undefined, // set undefined for already populated fields
        };
      }
    });

    return associatedFields;
  }

  private checkFieldAccess(fieldConfig: ModelFieldConfig): boolean {
    const userGroups = this.user.groups.map((group: GroupAPRecord) => group.name.toLowerCase());

    // Check if `groupsAccessRights` is set in the fieldConfig
    if (fieldConfig.groupsAccessRights) {
      const allowedGroups = fieldConfig.groupsAccessRights.map((item: string) => item.toLowerCase());
      return userGroups.some(group => allowedGroups.includes(group));
    } else {
      // If no specific groups are allowed, deny access if the user is in "default user group"
      return !userGroups.includes("default user group");
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
        } else {
          sails.log.error(`Error trying to check access to field: ${fieldConfig.model.model}.${fieldKey}`)
        }
      }
    }

    return filteredRecord;
  }

  /** Filters associated records (simplified process() function) */
  private filterAssociatedRecord<T>(associatedRecord: T, associatedFieldsConfig: { [fieldName: string]: Field }): Partial<T> {
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
    // if (association many to many) {
    //   sails.log не реализовано
    // }

    // if (association) {
    //   проверяем userAccessRelation из конфига и ищем в критерии поле которое лежит в  userAccessRelation в конфиге
    // смотрим что это связь на модель UserAP или GroupAP и если нет, отказываем, если да, проверяем что это ты
    // }
    // TODO читаем конфиг, записываем в критерию userId на поле связи
    // TODO есть проблема для ORM, которые связь many-to-many не позволяют искать по связи (в том числе waterline)
    return criteria;
  }

  // TODO сделать тест на DataAccessor на подложенных данных на метод getFieldsConfig и на process
  // TODO запустить админку и вытащить примеры entity и конфигов для дальнейшего создания теста
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
