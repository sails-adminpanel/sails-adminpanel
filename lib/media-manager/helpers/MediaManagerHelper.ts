import {Fields} from "../../../helper/fieldsHelper";
import {MediaManagerHandler} from "../MediaManagerHandler";
import {Data, Item, WidgetItem, widgetJSON} from "../AbstractMediaManager"
import {BaseFieldConfig, ModelConfig} from "../../../interfaces/adminpanelConfig";

type PostParams = Record<string, string | number | boolean | object | string[] | number[] | null>;

/**
 * Create a random file name with prefix and type. If prefix is true, the file name will be prefixed with a random string.
 * @param filenameOrig
 * @param type
 * @param prefix
 */
export function randomFileName(filenameOrig: string, type: string, prefix: boolean) {
	// make random string in end of file
	const prefixLength = 8;
	const randomPrefix = prefix ? Math.floor(Math.random() * Math.pow(36, prefixLength)).toString(36) : ''

	return filenameOrig.replace(/\.[^.]+$/, `_${randomPrefix}${type}$&`)
}

/**
 * Save media manager relations to database.
 * @param fields
 * @param reqData
 * @param model
 * @param recordId
 */
export async function saveRelationsMediaManager(fields: Fields, reqData: PostParams, model: string, recordId: string) {
	for (let prop in reqData) {
		if (fields[prop]?.config?.type === 'mediamanager') {
			let data = reqData[prop] as Data;
			let mediaManager = MediaManagerHandler.get(data.mediaManagerId)
			await mediaManager.saveRelations(data, model, recordId, prop)
		}
	}
}

export async function getRelationsMediaManager(data: widgetJSON) {
	let mediaManager = MediaManagerHandler.get(data.mediaManagerId)
	return await mediaManager.getRelations(data.list)
}

export async function updateRelationsMediaManager(fields: Fields, reqData: PostParams, model: string, recordId: string) {
	for (let prop in reqData) {
		if (fields[prop]?.config?.type === 'mediamanager') {
			let data = reqData[prop] as Data;
			let mediaManager = MediaManagerHandler.get(data.mediaManagerId)
			await mediaManager.updateRelations(data, model, recordId, prop)
		}
	}
}

export async function deleteRelationsMediaManager(model: string, record: {[p: string]: string | WidgetItem[]}[]) {
	let config = sails.config.adminpanel.models[model] as ModelConfig
	for (const key of Object.keys(record[0])) {
		let field = config.fields[key] as BaseFieldConfig
		if(field && field.type ==='mediamanager') {
			let mediaManager = MediaManagerHandler.get(field.options.id ?? 'default')
			await mediaManager.deleteRelations(model, record[0].id as string)
		}
	}
}
