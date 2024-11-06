"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModel = void 0;
// RENAME DataAccessor
class DataModel {
    constructor(user, entity, type) {
        this.user = user;
        this.entity = entity;
        this.type = type;
    }
    // TODO here we duplicate the FieldsHelper.getFields function (optimized) taking into account access rights
    // TODO hide if there is no access for realiton model
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
    // remove poulateALL from Waterline adapetr
    async loadAssociations(fields) {
        return Promise.resolve(null);
    }
}
exports.DataModel = DataModel;
