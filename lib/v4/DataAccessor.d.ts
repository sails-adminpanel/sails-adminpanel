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
    constructor(user: UserAPRecord, entity: Entity, type: ActionType);
    /**
     * Retrieves the fields for the given entity based on action type,
     * taking into account access rights and configuration settings.
     * @returns {Fields} An object with configured fields and their properties.
     */
    getFields(): Fields;
    loadAssociations(fields: Fields): Promise<Fields>;
    /**
     * Normalizes field configuration from various formats.
     *
     * @param config Field configuration in boolean, string, or object notation
     * @param key Field key name
     * @param modelField Field model configuration
     * @returns Normalized field configuration or `false` if the field should be hidden
     */
    private static _normalizeFieldConfig;
    /**
     * Helper function to determine the display field for associations.
     * Checks if 'name' or 'label' exists in model attributes, defaults to 'id'.
     *
     * @param attributes Model attributes
     * @returns Field name to use as display field
     */
    private static _getDisplayField;
}
