import ORMModel from "./ORMModel";
import {EntityConfig} from "./adminpanelConfig";

export interface Entity {
    name: string
    config: EntityConfig
    model: ORMModel
    uri: string
}

export interface AccessRightsToken {
    name: string
    description: string
    department: string
    id: string
}
