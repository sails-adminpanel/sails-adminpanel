/**
 * The class manages the interaction between the user and the database entry, taking into account user permissions and the main config file settings.
 */
import {UserAPRecord} from "../../models/UserAP";
import {Entity} from "../../interfaces/types";
import {ActionType, BaseFieldConfig} from "../../interfaces/adminpanelConfig";
import {FieldModel, Fields} from "../../helper/fieldsHelper";
import {AdminUtil} from "../adminUtil";
import {ConfigHelper} from "../../helper/configHelper";

export class DataAccessor {
  user: UserAPRecord;
  entity: Entity;
  type: ActionType
  fields: Fields = null;

  constructor(user: UserAPRecord, entity: Entity, type: ActionType) {
    this.user = user;
    this.entity = entity;
    this.type = type
  }

  // TODO add account access rights check
  // TODO hide if there is no access for relation model
  /**
   * Retrieves the fields for the given entity based on action type,
   * taking into account access rights and configuration settings.
   * @returns {Fields} An object with configured fields and their properties.
   */
  public getFields(): Fields {
    if (!this.entity.model || !this.entity.model.attributes) {
      return {};
    }

    // get action and field configs
    const actionConfig = AdminUtil.findActionConfig(this.entity, this.type);
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
      if (this.type === "add" && key === sails.config.adminpanel.identifierField) {
        return;
      }

      // Getting base field config
      let fldConfig: any = { key: key, title: key };
      let ignoreField = false; // if set to true, field will be removed from editor/list

      // Check global config from file
      if (fieldsConfig[key] !== undefined) {
        // if config is set to false ignore this field
        if (fieldsConfig[key] === false) {
          ignoreField = true;
        } else {
          fldConfig = { ...fldConfig, ...ConfigHelper.normalizeFieldConfig(fieldsConfig[key], key, modelField) };
        }
      }

      // TODO Check access rights to a specific field
      // TODO если у поля есть groupsAccessRight, то начинаем проверку. Если нету, значит разрешено для всех кроме дефолтного юзера (относится к defaultUserGroup )
      // TODO в поле groupsAccessRight будут лежать "name" от GroupAP. Это будут имена групп, которым разрешен доступ.
      //  Мы сравниваем что groupsAccessRight содержит хоть один элемент из user.groups (используем lowercase)
      // TODO defaultUserGroup нужно создать если ее не будет

      // Checking inaction entity fields configuration. Should overwrite global one
      if (actionConfig.fields[key] !== undefined) {
        if (actionConfig.fields[key] === false) {
          ignoreField = true;
        } else {
          fldConfig = { ...fldConfig, ...ConfigHelper.normalizeFieldConfig(actionConfig.fields[key], key, modelField) };
        }
      }

      if (ignoreField) {
        return;
      }

      // Set required flag and type
      fldConfig.required = Boolean(fldConfig.required || modelField.required);
      // Default type for field. Could be fetched form config file or file model if not defined in config file.
      fldConfig.type = fldConfig.type || modelField.type;
      // All field types should be in lower case
      fldConfig.type = fldConfig.type.toLowerCase();

      // Normalizing final config
      fldConfig = ConfigHelper.normalizeFieldConfig(fldConfig, key, modelField);

      // Add new field to result set
      result[key] = { config: fldConfig, model: modelField };
    });

    this.fields = result;
    return result;
  }

  // TODO associations should load taking into account another DataModel instance for keeping populated data safety
  // TODO remove poulateALL from Waterline adapetr
  public async getPopulatedFields(): Promise<Fields>{
    if (this.fields) {
      // TODO сразу делаем loadAssociations
    } else {
      // TODO вызываем getFields, а после делаем loadAssociations
    }

    // TODO 1. достаем модели, к которым есть связи у текущих филдов
    // TODO 2. проверяем есль ли доступ к этим моделям через access rights helper
    // TODO 3. если да, то прогоняем им getFields чтобы узнать к каким именно полям уже этих моделей есть доступ
    // TODO 4. все собираем в один большой обьект и возвращаем

    return Promise.resolve(null)
  }
}
