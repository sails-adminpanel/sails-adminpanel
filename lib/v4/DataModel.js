"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModel = void 0;
class DataModel {
    constructor(user, entity, type) {
        this.user = user;
        this.entity = entity;
        this.type = type;
    }
    // TODO тут дублируем функцию FieldsHelper.getFields (оптимизированную) с учетом прав доступа
    getFields() {
        let a = this.entity.config.edit;
        if (typeof a !== "boolean") {
            let b = a.fields["aaa"];
            if (typeof b === "object") {
                b.groupsAccessRights.length;
            }
        }
    }
    // associations should load taking into account another DataModel instance for keeping populated data safety
    async loadAssociations(fields) {
        return Promise.resolve(null);
    }
}
exports.DataModel = DataModel;
