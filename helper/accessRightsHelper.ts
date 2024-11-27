import {GroupAPRecord} from "../models/GroupAP";
import {AccessRightsToken} from "../interfaces/types";
import {UserAPRecord} from "../models/UserAP";

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

	public static registerTokens(accessRightsTokens: AccessRightsToken[]): void {
		for (let token of accessRightsTokens) {
			AccessRightsHelper.registerToken(token)
		}
	}

	public static getTokens(): AccessRightsToken[] {
		return this._tokens
	}

	public static getTokensByDepartment(department: string): AccessRightsToken[] {
		return this._tokens.filter((token) => {
			return token.department === department
		})
	}

	public static getAllDepartments(): string[] {
		return this._tokens
			.map((token) => {
				return token.department
			})
			.filter(function (item, pos, self) {
				return self.indexOf(item) == pos
			})
	}

	public static enoughPermissions(tokens: string[], user: UserAPRecord): boolean {
		if (user.isAdministrator) {
			return true;
		}

		if (!tokens.length) {
			return false
		}

		let enoughPermissions = false
		tokens.forEach((token) => {
			let havePermission = this.havePermission(token, user)
			if (havePermission) enoughPermissions = true
		})
		return enoughPermissions
	}

	public static havePermission(tokenId: string, user: UserAPRecord): boolean {
		if(!adminizer.config.auth) {
			return true
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
			adminizer.log.error("Adminpanel > Token is not valid");
			return false;
		}

		let allow = false;
		for (let group of user.groups as GroupAPRecord[]) {
			if (group.tokens.includes(tokenId)) {
				allow = true;
				break;
			}
		}

		return true;
	}
}
