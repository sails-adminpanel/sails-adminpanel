import StrippedORMModel from "./StrippedORMModel";
import {ModelConfig} from "./adminpanelConfig";

export interface Entity {
    name: string
    config?: ModelConfig
    model?: Model<Models[keyof Models]> & { attributes: SailsModelAnyInstance }
    uri: string
    type: string
}

export interface AccessRightsToken {
    name: string
    description: string
    department: string
    id: string
}
