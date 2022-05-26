import { AccessRightsToken } from "../interfaces/types";
export declare class AccessRightsHelper {
    private static _tokens;
    static registerToken(accessRightsToken: AccessRightsToken): void;
    static getTokens(): AccessRightsToken[];
    static getTokensByDepartment(department: string): AccessRightsToken[];
    static getAllDepartments(): string[];
}
