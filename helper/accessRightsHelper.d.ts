import { AccessRightsToken } from "../interfaces/types";
import UserAP from "../models/UserAP";
import userAP from "../models/UserAP";
export declare class AccessRightsHelper {
    private static _tokens;
    static registerToken(accessRightsToken: AccessRightsToken): void;
    static registerTokens(accessRightsTokens: AccessRightsToken[]): void;
    static getTokens(): AccessRightsToken[];
    static getTokensByDepartment(department: string): AccessRightsToken[];
    static getAllDepartments(): string[];
    static enoughPermissions(tokens: string[], user: userAP): boolean;
    static havePermission(tokenId: string, user: UserAP): boolean;
}
