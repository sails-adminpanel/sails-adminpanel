import { Fields } from "../../../helper/fieldsHelper";
import { MediaManagerHandler } from "../MediaManagerHandler";
import { MediaManagerWidgetData, MediaManagerItem, MediaManagerWidgetItem, MediaManagerWidgetJSON } from "../AbstractMediaManager"
import { BaseFieldConfig, MediaManagerOptionsField, ModelConfig } from "../../../interfaces/adminpanelConfig";

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
		let fieldConfigConfig = fields[prop].config as BaseFieldConfig;
		if (fieldConfigConfig.type === 'mediamanager') {
			let data = reqData[prop] as MediaManagerWidgetData;
			let mediaManager = MediaManagerHandler.get(data.mediaManagerId)
			await mediaManager.setRelations(data, model, recordId, prop)
		}
	}
}

/*
* Get realtions
* @param data
*/
export async function getRelationsMediaManager(data: MediaManagerWidgetJSON) {
	let mediaManager = MediaManagerHandler.get(data.mediaManagerId)
	return await mediaManager.getRelations(data.list)
}

/*
* Delate Ralations
* @param model
* @param record
*/
export async function deleteRelationsMediaManager(model: string, record: { [p: string]: string | MediaManagerWidgetItem[] }[]) {
	let config = sails.config.adminpanel.models[model] as ModelConfig
	for (const key of Object.keys(record[0])) {
		let field = config.fields[key] as BaseFieldConfig
		if (field && field.type === 'mediamanager') {
			const option = field.options as MediaManagerOptionsField
			let mediaManager = MediaManagerHandler.get(option?.id ?? 'default')
			let emptyData: MediaManagerWidgetData = {
				list: [],
				mediaManagerId: ''
			}
			await mediaManager.setRelations(emptyData, model, record[0].id as string, key)
		}
	}
}

/**
 * @param items
 */
export async function populateVariants(variants: MediaManagerItem[], model: string): Promise<MediaManagerItem[]> {
	let items: MediaManagerItem[] = []
	for (let variant of variants) {
		variant = (await sails.models[model].find({ where: { id: variant.id } }).populate("meta"))[0]
		items.push(variant)
	}
	return items;
}
