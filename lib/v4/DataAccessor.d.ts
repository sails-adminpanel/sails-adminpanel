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
    action: ActionType;
    private fields;
    constructor(user: UserAPRecord, entity: Entity, action: ActionType);
    /**
     * Retrieves the fields for the given entity based on action type,
     * taking into account access rights and configuration settings.
     * @returns {Fields} An object with configured fields and their properties.
     */
    getFieldsConfig(): Fields;
    private getAssociatedFieldsConfig;
    private checkFieldAccess;
    /**
     * Returns filtered record applying config from this.fields on this record
     * @data - record from a specific model */
    process<T>(record: T): Partial<T>;
    /** Filters associated records (simplified process() function) */
    private filterAssociatedRecord;
    /** Process for an array of records */
    processMany<T>(records: T[]): Partial<T>[];
    sanitizeUserRelationAccess<T>(criteria: T): Promise<Partial<T>>;
    setUserRelationAccess<T>(record: T): Promise<Partial<T>>;
}
