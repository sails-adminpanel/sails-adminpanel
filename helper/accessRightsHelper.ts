import {AccessRightsToken} from "../interfaces/types";

export class AccessRightsHelper {

    private _tokens = [];

    public static registerToken(accessRightsToken: AccessRightsToken): void {
        // положить все в массив _tokens
        // проверить что айди уникальное, пересмотреть список
        // проверка что все поля есть
        return
    }

    public static getTokens(): AccessRightsToken[] {
        return
    }

    public static getTokensByDepartment() {
    }

    public static getAllDepartments() {
        // на фигме заголовок это department
        // параметр доступа это name токена
        // description сделать на hint (обычный hint html)
    }
}
