import {
    AbstractCatalog,
    AbstractGroup,
    AbstractItem
} from "adminizer";
import {v4 as uuid} from "uuid";

export class NavigationStorage {
    storageMap = new Map();
    ready;
	runtime;
	id;
	model;

    constructor(
        runtime,
        id,
        model
    ) {
        this.runtime = runtime;
        this.id = id;
        this.model = model;
		this.ready = this.initModel();
	}

    navigationModel() {
        return this.runtime.models.get(this.model);
    }

    async initModel() {
        const navigation = await this.navigationModel().findOne({where: {label: this.id}});
        if (navigation) {
            await this.populateFromTree(navigation.tree);
            return;
        }

        await this.navigationModel().create({
            label: this.id,
            tree: [],
        });
    }

    getId() {
        return this.id;
    }

     async buildTree() {
        const rootElements = await this.findElementsByParentId(null, null);
        const buildSubTree = async (elements) => {
            const tree = [];
            for (const element of elements) {
                const children = await this.findElementsByParentId(element.id, null);
                tree.push({
                    ...element,
                    children: await buildSubTree(children),
                });
            }
            return tree;
        };

        const tree = await buildSubTree(rootElements);
        const sortTree = (items) => {
            items.sort((a, b) => a.sortOrder - b.sortOrder);
            for (const item of items) {
                if (item.children) {
                    sortTree(item.children);
                }
            }
        };

        sortTree(tree);
        return tree;
    }

    async populateFromTree(tree) {
        const traverseTree = async (node) => {
            const {children, ...itemData} = node;
            const item = {
                ...itemData,
                parentId: itemData.parentId === 0 ? null : itemData.parentId,
            };
            await this.setElement(item.id, item, true);

            if (children?.length) {
                for (const child of children) {
                    await traverseTree(child);
                }
            }
        };

        for (const node of tree) {
            await traverseTree(node);
        }
    }

    async setElement(_id, item, init = false) {
        this.storageMap.set(item.id, item);
        if (!init) {
            await this.saveToDB();
        }
        return this.findElementById(item.id);
    }

    async removeElementById(id) {
        this.storageMap.delete(id);
        await this.saveToDB();
    }

    async findElementById(id) {
        return this.storageMap.get(id);
    }

    async findElementByModelId(modelId) {
        const elements = [];
        for (const item of this.storageMap.values()) {
            if (item.modelId === modelId) {
                elements.push(item);
            }
        }
        return elements;
    }

    async saveToDB() {
        const tree = await this.buildTree();
        await this.navigationModel().update(
            {where: {label: this.id}},
            {tree: tree}
        );
    }

    async findElementsByParentId(parentId, type) {
        const elements = [];
        const normalizedParentId = parentId === 0 ? null : parentId;
        for (const item of this.storageMap.values()) {
            if (type === null && item.parentId === normalizedParentId) {
                elements.push(item);
                continue;
            }
            if (item.parentId === normalizedParentId && item.type === type) {
                elements.push(item);
            }
        }
        return elements;
    }

    async search(s, type) {
        const lowerCaseQuery = s.toLowerCase();
        return Array.from(this.storageMap.values()).filter((item) =>
            item.type === type && item.name.toLowerCase().includes(lowerCaseQuery)
        );
    }
}

export class NavigationStorageServices {
    storages  = [];

    add(storage){
        this.storages.push(storage);
    }

    get(id){
        return this.storages.find((storage) => storage.getId() === id);
    }

    async ready() {
        await Promise.all(this.storages.map((storage) => storage.ready));
    }
}

export class NavigationCatalog extends AbstractCatalog {
    name = "Navigation";
    slug = "navigation";
    icon = "box";
    actionHandlers = [];
    idList = [];
    storageServices;

    constructor(runtime, config) {
        const storageServices = new NavigationStorageServices();
        const items = config.items.map((configElement) => new NavigationItem(
            runtime,
            configElement.title,
            configElement.model,
            config.model,
            configElement.urlPath,
            storageServices
        ));

        items.push(new NavigationGroup(config.groupField, storageServices));
        items.push(new LinkItem(storageServices));

        super(createLegacyCatalogHost(), items);

        this.storageServices = storageServices;
        for (const section of config.sections) {
            this.storageServices.add(new NavigationStorage(runtime, section, config.model));
        }

        this.movingGroupsRootOnly = config.movingGroupsRootOnly;
        this.idList = config.sections ?? [];
    }

    async getIdList() {
        return this.idList;
    }

    async ready() {
        await this.storageServices.ready();
    }
}

class NavigationItem extends AbstractItem {
    allowedRoot = true;
    icon;
    name;
    type;
    adminizer = createLegacyCatalogHost();
    actionHandlers = [];
	storageServices;
	runtime;
	model;
	urlPath

    constructor(
        runtime,
        name,
        model,
        navigationModel,
        urlPath,
        storageServices
    ) {
        super();
		this.runtime = runtime;
		this.model = model;
		this.urlPath = urlPath;
        this.name = name;
        this.type = model.toLowerCase();
        const configModel = runtime.config.getModelConfig(model);
        this.icon = configModel?.icon ?? "file_present";
        this.storageServices = storageServices;
    }

    contentModel() {
        return this.runtime.models.get(this.model);
    }

    async create(data, catalogId) {
        const storage = this.getStorage(catalogId);
        let storageData;
        if (data._method === "select") {
            const record = await this.contentModel().findOne({where: {id: data.record}});
            storageData = await this.dataPreparation({
                record,
                parentId: data.parentId,
                targetBlank: data.targetBlank,
                visible: data.visible,
            }, catalogId);
        } else {
            storageData = await this.dataPreparation(data, catalogId);
        }
        return await storage.setElement(data.id, storageData);
    }

    async dataPreparation(data, catalogId, sortOrder) {
        const storage = this.getStorage(catalogId);
        const record = data.record;
        const urlPath = this.renderUrlPath(record);
        let parentId = data.parentId ? data.parentId : null;
        if (parentId === 0) parentId = null;

        return {
            id: uuid(),
            modelId: record.id,
            targetBlank: data.targetBlank ?? record.targetBlank,
            visible: data.visible ?? record.visible,
            isNavigation: true,
            name: record.name ?? record.title ?? record.id,
            parentId,
            sortOrder: sortOrder ?? (await storage.findElementsByParentId(parentId, null)).length,
            icon: this.icon,
            type: this.type,
            urlPath,
        };
    }

    async updateModelItems(modelId, data, catalogId) {
        const storage = this.getStorage(catalogId);
        const items = await storage.findElementByModelId(modelId);
        const response = [];
        for (const item of items) {
            item.name = data.record.name ?? data.record.title ?? data.record.id;
            item.urlPath = this.renderUrlPath(data.record);
            if (item.id === data.record.treeId) {
                item.targetBlank = data.record.targetBlank;
                item.visible = data.record.visible;
            }
            response.push(await storage.setElement(item.id, item));
        }
        return response[0];
    }

    async update(itemId, data, catalogId) {
        return await this.getStorage(catalogId).setElement(itemId, data);
    }

    async deleteItem(itemId, catalogId) {
        await this.getStorage(catalogId).removeElementById(itemId);
    }

    async find(itemId, catalogId) {
        return await this.getStorage(catalogId).findElementById(itemId);
    }

    async getChilds(parentId, catalogId) {
        return await this.getStorage(catalogId).findElementsByParentId(parentId, this.type);
    }

	async getAddTemplate(req) {
		const itemsDB = await this.contentModel().find({});
		const items = itemsDB.map((item) => ({
			id: item.id,
			name: item.name ?? item.title ?? item.id,
		}));
		return {
			type: "navigation.model-link",
			data: {
				items,
				model: this.model,
				labels: {
					selectTitle: `${req.i18n.__("Select")} ${req.i18n.__(this.name + "s")}`,
					createTitle: `${req.i18n.__("create new")} ${req.i18n.__(this.name + "s")}`,
					OR: req.i18n.__("OR"),
					openInNewWindow: req.i18n.__("Open in a new window"),
					visible: req.i18n.__("Visible"),
				},
			},
		};
	}

    async getEditTemplate(id, catalogId){
        return {
            type: "navigation.model-link",
            data: {
                item: await this.find(id, catalogId),
                model: this.model,
            },
        };
    }

    async search(s, catalogId) {
        return await this.getStorage(catalogId).search(s, this.type);
    }

    getStorage(catalogId) {
        const storage = this.storageServices.get(catalogId);
        if (!storage) {
            throw new Error(`Navigation storage "${catalogId}" was not found`);
        }
        return storage;
    }

    renderUrlPath(record) {
        return this.urlPath.replace(/\$\{data\.record\.([^}]+)\}/g, (_match, field) =>
            encodeURIComponent(record?.[field] ?? "")
        );
    }
}

class NavigationGroup extends AbstractGroup {
    allowedRoot = true;
    name = "Group";
    groupField = [];
    adminizer = createLegacyCatalogHost();
	storageServices;

    constructor(groupField, storageServices) {
        super();
        this.groupField = groupField;
        this.storageServices = storageServices;
    }

    async create(data, catalogId) {
        let storageData = await this.dataPreparation(data, catalogId);
        delete data.name;
        delete data.parentId;
        storageData = {...storageData, ...data};
        return await this.getStorage(catalogId).setElement(storageData.id, storageData);
    }

    async dataPreparation(data, catalogId, sortOrder) {
        const storage = this.getStorage(catalogId);
        let parentId = data.parentId ? data.parentId : null;
        if (parentId === 0) parentId = null;
        return {
            id: uuid(),
            name: data.name,
            targetBlank: data.targetBlank,
            visible: data.visible,
            isNavigation: true,
            parentId,
            sortOrder: sortOrder ?? (await storage.findElementsByParentId(parentId, null)).length,
            icon: this.icon,
            type: this.type,
        };
    }

    async deleteItem(itemId, catalogId) {
        await this.getStorage(catalogId).removeElementById(itemId);
    }

    async find(itemId, catalogId) {
        return await this.getStorage(catalogId).findElementById(itemId);
    }

    async update(itemId, data, catalogId) {
        return await this.getStorage(catalogId).setElement(itemId, data);
    }

    async updateModelItems(modelId, data, catalogId) {
        return await this.getStorage(catalogId).setElement(modelId, data);
    }

    getAddTemplate(req) {
        const items = this.groupField.map((field) => ({
            name: field.name,
            label: field.label,
            required: field.required,
        }));
        return Promise.resolve({
            type: "navigation.group",
            data: {
                items,
                labels: {
                    openInNewWindow: req.i18n.__("Open in a new window"),
                    visible: req.i18n.__("Visible"),
                    title: req.i18n.__("Title"),
                    save: req.i18n.__("Save"),
                },
            },
        });
    }

    async getEditTemplate(id, catalogId, req) {
        const items = this.groupField.map((field) => ({
            name: field.name,
            label: field.label,
            required: field.required,
        }));
        return {
            type: "navigation.group",
            data: {
                items,
                item: await this.find(id, catalogId),
                labels: {
                    openInNewWindow: req.i18n.__("Open in a new window"),
                    visible: req.i18n.__("Visible"),
                    title: req.i18n.__("Title"),
                    save: req.i18n.__("Save"),
                },
            },
        };
    }

    async getChilds(parentId, catalogId) {
        return await this.getStorage(catalogId).findElementsByParentId(parentId, this.type);
    }

    async search(s, catalogId) {
        return await this.getStorage(catalogId).search(s, this.type);
    }

    getStorage(catalogId) {
        const storage = this.storageServices.get(catalogId);
        if (!storage) {
            throw new Error(`Navigation storage "${catalogId}" was not found`);
        }
        return storage;
    }
}

class LinkItem extends NavigationGroup {
    allowedRoot = true;
    icon = "insert_link";
    name = "Link";
    type = "link";
    isGroup = false;

    constructor(storageServices) {
        super([], storageServices);
    }

    getAddTemplate(req) {
        return Promise.resolve({
            type: "navigation.link",
            data: {
                items: [{
                    label: req.i18n.__("Link"),
                    name: "link",
                    required: true,
                }],
                labels: {
                    title: req.i18n.__("Title"),
                    openInNewWindow: req.i18n.__("Open in a new window"),
                    visible: req.i18n.__("Visible"),
                    save: req.i18n.__("Save"),
                },
            },
        });
    }

    async getEditTemplate(id, catalogId, req) {
        return {
            type: "navigation.link",
            data: {
                items: [{
                    label: req.i18n.__("Link"),
                    name: "link",
                    required: true,
                }],
                item: await this.find(id, catalogId),
                labels: {
                    openInNewWindow: req.i18n.__("Open in a new window"),
                    visible: req.i18n.__("Visible"),
                    title: req.i18n.__("Title"),
                    save: req.i18n.__("Save"),
                },
            },
        };
    }
}

function createLegacyCatalogHost() {
    return {
        accessRightsHelper: {
            registerToken: () => undefined,
        },
    };
}
