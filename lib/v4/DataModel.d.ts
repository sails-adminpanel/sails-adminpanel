/**
 * The class manages the interaction between the user and the database entry, taking into account user permissions and the main config file settings.
 */
import { UserAPRecord } from "../../models/UserAP";
import { Entity } from "../../interfaces/types";
import { ActionType } from "../../interfaces/adminpanelConfig";
import { Fields } from "../../helper/fieldsHelper";
export declare class DataModel {
    user: UserAPRecord;
    entity: Entity;
    type: ActionType;
    constructor(user: UserAPRecord, entity: Entity, type: ActionType);
    getFields(): void;
    loadAssociations(fields: Fields): Promise<Fields>;
}
