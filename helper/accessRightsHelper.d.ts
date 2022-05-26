import { AccessRightsToken } from "../interfaces/types";
export declare class AccessRightsHelper {
    private _tokens;
    static registerToken(accessRightsToken: AccessRightsToken): void;
    static getTokens(): AccessRightsToken[];
    static getTokensByDepartment(): void;
    static getAllDepartments(): void;
}
