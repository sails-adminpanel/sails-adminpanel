import ORMModel from "./ORMModel";
import {ModelConfig} from "./adminpanelConfig";

export interface Entity {
    name: string
    config: ModelConfig
    model?: ORMModel
    uri: string
    type: string
}

export interface AccessRightsToken {
    name: string
    description: string
    department: string
    id: string
}
