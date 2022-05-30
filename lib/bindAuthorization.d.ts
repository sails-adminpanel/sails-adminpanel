import UserAP from "../models/UserAP";
export default function bindAuthorization(): Promise<void>;
/**
 * Add method to check permission from controller
 */
export declare function havePermission(tokenId: string, user: UserAP): boolean;
