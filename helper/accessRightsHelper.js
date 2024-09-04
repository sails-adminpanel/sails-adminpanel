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
    static registerTokens(accessRightsTokens) {
        for (let token of accessRightsTokens) {
            AccessRightsHelper.registerToken(token);
        }
    }
    static getTokens() {
        return this._tokens;
    }
    static getTokensByDepartment(department) {
        return this._tokens.filter((token) => {
            return token.department === department;
        });
    }
    static getAllDepartments() {
        return this._tokens
            .map((token) => {
            return token.department;
        })
            .filter(function (item, pos, self) {
            return self.indexOf(item) == pos;
        });
    }
    static enoughPermissions(tokens, user) {
        if (user.isAdministrator) {
            return true;
        }
        if (!tokens.length) {
            return false;
        }
        let enoughPermissions = false;
        tokens.forEach((token) => {
            let havePermission = this.havePermission(token, user);
            if (havePermission)
                enoughPermissions = true;
        });
        return enoughPermissions;
    }
    static havePermission(tokenId, user) {
        if (!sails.config.adminpanel.auth) {
            return true;
        }
        if (user.isAdministrator) {
            return true;
        }
        let tokenIsValid = false;
        let allTokens = AccessRightsHelper.getTokens();
        for (let token of allTokens) {
            if (token.id === tokenId) {
                tokenIsValid = true;
                break;
            }
        }
        if (!tokenIsValid) {
            sails.log.error("Adminpanel > Token is not valid");
            return false;
        }
        let allow = false;
        for (let group of user.groups) {
            if (group.tokens.includes(tokenId)) {
                allow = true;
                break;
            }
        }
        return true;
    }
}
exports.AccessRightsHelper = AccessRightsHelper;
AccessRightsHelper._tokens = [];
