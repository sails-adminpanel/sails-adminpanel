import ORMModel from "./ORMModel";
import {InstanceConfig} from "./adminpanelConfig";

export interface Instance {
    name: string
    config: InstanceConfig
    model: ORMModel
    uri: string
}

export interface AccessRightsToken {
    name: string
    description: string
    department: string
    id: string
}
