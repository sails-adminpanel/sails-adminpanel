"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessRightsHelper = void 0;
class AccessRightsHelper {
    static registerToken(accessRightsToken) {
        if (!accessRightsToken.id || !accessRightsToken.name || !accessRightsToken.description || !accessRightsToken.department) {
            throw new Error("Adminpanel > Can not register token: Missed one or more required parameters");
        }
        for (let token of this._tokens) {
            if (token.id === accessRightsToken.id) {
                throw new Error("Adminpanel > Can not register token: Token with this id already registered");
            }
        }
        this._tokens.push(accessRightsToken);
    }
    static getTokens() {
        return this._tokens;
    }
    static getTokensByDepartment(department) {
        return this._tokens.filter((token) => { return token.department === department; });
    }
    static getAllDepartments() {
        return this._tokens
            .map((token) => { return token.department; })
            .filter(function (item, pos, self) { return self.indexOf(item) == pos; });
        // на фигме заголовок это department
        // параметр доступа это name токена
        // description сделать на hint (обычный hint html)
    }
}
exports.AccessRightsHelper = AccessRightsHelper;
AccessRightsHelper._tokens = [];
