import StrippedORMModel from "./StrippedORMModel";
import {ModelConfig} from "./adminpanelConfig";

export type EntityType = "form" | "model" | "wizard";
export interface Entity {
    name: string
    config?: ModelConfig
    /** @deprecated all interaction with the orm model will be performed by DataModel class */
    model?: Model<Models[keyof Models]> & { attributes: SailsModelAnyInstance }
    uri: string
    type: EntityType
}

export interface AccessRightsToken {
    name: string
    description: string
    department: string
    id: string
}
