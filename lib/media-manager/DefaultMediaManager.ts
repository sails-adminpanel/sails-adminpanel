import {AbstractMediaManager, Item, File} from "./AbstractMediaManager";
import {ApplicationItem, ImageItem, TextItem} from "./Items";

export class DefaultMediaManager extends AbstractMediaManager {
	public readonly itemTypes: File<Item>[] = [];

	constructor(id: string, path: string, dir: string, model: string, metaModel: string) {
		super(id, path, dir, model);
		this.itemTypes.push(new ImageItem( path, dir, model, metaModel))
		this.itemTypes.push(new TextItem( path, dir, model, metaModel))
		this.itemTypes.push(new ApplicationItem( path, dir, model, metaModel))
	}

	public async getAll(limit: number, skip: number, sort: string): Promise<{ data: Item[], next: boolean }> {
		let data: Item[] = await sails.models[this.model].find({
			where: {parent: null},
			limit: limit,
			skip: skip,
			sort: sort//@ts-ignore
		}).populate('children', {sort: sort})

		let next: number = (await sails.models[this.model].find({
			where: {parent: null},
			limit: limit,
			skip: skip === 0 ? limit : skip + limit,
			sort: sort
		})).length

		return {
			data: data,
			next: !!next
		}
	}
}
