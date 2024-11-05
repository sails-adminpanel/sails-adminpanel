/**
 * The class manages the interaction between the user and the database entry, taking into account user permissions and the main config file settings.
 */
import {UserAPRecord} from "../../models/UserAP";
import {Entity} from "../../interfaces/types";
import {ActionType} from "../../interfaces/adminpanelConfig";
import {Fields} from "../../helper/fieldsHelper";

export class DataModel {
  user: UserAPRecord;
  entity: Entity;
  type: ActionType

  constructor(user: UserAPRecord, entity: Entity, type: ActionType) {
    this.user = user;
    this.entity = entity;
    this.type = type
  }

  // TODO тут дублируем функцию FieldsHelper.getFields (оптимизированную) с учетом прав доступа
  public getFields() {
    let a = this.entity.config.edit;
    if (typeof a !== "boolean") {
      let b = a.fields["aaa"]
      if (typeof b === "object") {
        b.groupsAccessRights.length
      }
    }
  }

  // associations should load taking into account another DataModel instance for keeping populated data safety
  public async loadAssociations(fields: Fields): Promise<Fields>{
    return Promise.resolve(null)
  }
}
