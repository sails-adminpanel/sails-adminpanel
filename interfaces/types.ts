import { AbstractModel } from "../lib/v4/model/AbstractModel";
import {ModelConfig} from "./adminpanelConfig";

export type EntityType = "form" | "model" | "wizard";
export interface Entity {
    name: string
    config?: ModelConfig
    model?: AbstractModel<any>
    uri: string
    type: EntityType
}

export interface AccessRightsToken {
    name: string
    description: string
    department: string
    id: string
}
