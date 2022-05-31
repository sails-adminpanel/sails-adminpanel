import { AccessRightsToken } from "../interfaces/types";
import UserAP from "../models/UserAP";
export declare class AccessRightsHelper {
    private static _tokens;
    static registerToken(accessRightsToken: AccessRightsToken): void;
    static getTokens(): AccessRightsToken[];
    static getTokensByDepartment(department: string): AccessRightsToken[];
    static getAllDepartments(): string[];
    static havePermission(tokenId: string, user: UserAP): boolean;
}
