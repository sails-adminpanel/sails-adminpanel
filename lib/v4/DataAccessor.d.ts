/**
 * The class manages the interaction between the user and the database entry, taking into account user permissions and the main config file settings.
 */
import { UserAPRecord } from "../../models/UserAP";
import { Entity } from "../../interfaces/types";
import { ActionType } from "../../interfaces/adminpanelConfig";
import { Fields } from "../../helper/fieldsHelper";
export declare class DataAccessor {
    user: UserAPRecord;
    entity: Entity;
    type: ActionType;
    fields: Fields;
    constructor(user: UserAPRecord, entity: Entity, type: ActionType);
    /**
     * Retrieves the fields for the given entity based on action type,
     * taking into account access rights and configuration settings.
     * @returns {Fields} An object with configured fields and their properties.
     */
    getFields(): Fields;
    getPopulatedFields(): Promise<Fields>;
}
