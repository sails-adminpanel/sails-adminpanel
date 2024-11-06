import { AccessRightsToken } from "../interfaces/types";
import { UserAPRecord } from "../models/UserAP";
export declare class AccessRightsHelper {
    private static _tokens;
    static registerToken(accessRightsToken: AccessRightsToken): void;
    static registerTokens(accessRightsTokens: AccessRightsToken[]): void;
    static getTokens(): AccessRightsToken[];
    static getTokensByDepartment(department: string): AccessRightsToken[];
    static getAllDepartments(): string[];
    static enoughPermissions(tokens: string[], user: UserAPRecord): boolean;
    static havePermission(tokenId: string, user: UserAPRecord): boolean;
}
