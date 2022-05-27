import {AccessRightsToken} from "../interfaces/types";

export class AccessRightsHelper {

    private static _tokens: AccessRightsToken[] = [];

    public static registerToken(accessRightsToken: AccessRightsToken): void {
        if (!accessRightsToken.id || !accessRightsToken.name || !accessRightsToken.description || !accessRightsToken.department) {
            throw new Error("Adminpanel > Can not register token: Missed one or more required parameters");
        }

        for (let token of this._tokens) {
            if (token.id === accessRightsToken.id) {
                throw new Error("Adminpanel > Can not register token: Token with this id already registered")
            }
        }

        this._tokens.push(accessRightsToken);
    }

    public static getTokens(): AccessRightsToken[] {
        return this._tokens
    }

    public static getTokensByDepartment(department: string): AccessRightsToken[] {
        return this._tokens.filter((token) => {return token.department === department})
    }

    public static getAllDepartments(): string[] {
        return this._tokens
            .map((token) => {return token.department})
            .filter(function(item, pos, self) {return self.indexOf(item) == pos})
        // на фигме заголовок это department
        // параметр доступа это name токена
        // description сделать на hint (обычный hint html)
    }
}
