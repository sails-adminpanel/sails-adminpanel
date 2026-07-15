import {
	AbstractMediaManager,
	populateVariants
} from "adminizer";
import {ApplicationItem, ImageItem, TextItem, VideoItem} from "./Items.mjs";

export const mediaManagerModelNames = {
	media: "MediaManagerAP",
	meta: "MediaManagerMetaAP",
	associations: "MediaManagerAssociationsAP",
}

export class DefaultMediaManager extends AbstractMediaManager {
	itemTypes = [];
	id;
	urlPathPrefix;
	fileStoragePath;
	runtime;

	constructor(
		runtime,
		id,
		urlPathPrefix,
		fileStoragePath,
		imageSizes
	) {
		super(createLegacyMediaManagerHost());
		this.runtime = runtime;
		this.id = id;
		this.urlPathPrefix = urlPathPrefix;
		this.fileStoragePath = fileStoragePath;
		this.itemTypes.push(new ImageItem(runtime, urlPathPrefix, fileStoragePath, imageSizes));
		this.itemTypes.push(new TextItem(runtime, urlPathPrefix, fileStoragePath));
		this.itemTypes.push(new ApplicationItem(runtime, urlPathPrefix, fileStoragePath));
		this.itemTypes.push(new VideoItem(runtime, urlPathPrefix, fileStoragePath));
	}

	async getAll(limit, skip, sort, group) {
		const media = this.runtime.models.get(mediaManagerModelNames.media);
		const where = {parent: null, group};
		const data = await media.find({
			where,
			limit,
			skip,
			sort,
			populate: {variants: {sort}, meta: true},
		});
		for (const item of data) {
			item.variants = await populateVariants(
				this.runtime,
				item.variants ?? [],
				mediaManagerModelNames.media
			);
		}
		const next = await media.find({where, limit, skip: skip + limit, sort});
		return {data, next: next.length > 0};
	}

	async searchAll(search, group) {
		const data = await this.runtime.models
			.get(mediaManagerModelNames.media)
			.find({
				where: {filename: {contains: search}, parent: null, group},
				sort: "createdAt DESC",
				limit: 1000,
				populate: {variants: {sort: "createdAt DESC"}, meta: true},
			});
		for (const item of data) {
			item.variants = await populateVariants(
				this.runtime,
				item.variants ?? [],
				mediaManagerModelNames.media
			);
		}
		return data;
	}

	async setRelations(
		data,
		model,
		modelId,
		widgetName
	) {
		if (modelId == null) {
			throw new Error("modelId must be a string or number");
		}

		const associations = this.runtime.models.get(
			mediaManagerModelNames.associations
		);
		const where = {
			modelId: String(modelId),
			model: model.toLowerCase(),
			widgetName,
		};
		for (const association of await associations.find({where})) {
			await associations.destroy({where: {id: association.id}});
		}
		for (const [index, item] of data.entries()) {
			await associations.create({
				mediaManagerId: this.id,
				model: model.toLowerCase(),
				modelId: String(modelId),
				file: item.id,
				widgetName,
				sortOrder: index + 1,
			});
		}
	}

	async getRelations(
		model,
		widgetName,
		modelId
	) {
		if (modelId == null) {
			throw new Error("modelId must be a string or number");
		}

		const files = await this.runtime.models.get(
			mediaManagerModelNames.associations
		).find({
			where: {
				model: model.toLowerCase(),
				widgetName,
				modelId: String(modelId),
			},
			sort: "sortOrder ASC",
			populate: {file: true},
		});

		return files
			.filter((association) => association.file)
			.map((association) => ({
				id: association.file.id,
				mimeType: association.file.mimeType,
				filename: association.file.filename,
				url: association.file.url,
				variants: [],
			}));
	}
}

function createLegacyMediaManagerHost() {
	return {
		accessRightsHelper: {
			registerToken: () => undefined,
		},
	}
}
