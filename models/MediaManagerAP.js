export default {
    id: {
        type: "number",
        autoIncrement: true,
        primaryKey: true
    },
    parent: {
        model: "MediaManagerAP"
    },
    variants: {
        collection: "MediaManagerAP",
        via: "parent"
    },
    mimeType: {
        type: "string"
    },
    path: {
        type: "string"
    },
    size: {
        type: "number"
    },
    group: {
        type: "string"
    },
    tag: {
        type: "string"
    },
    url: {
        type: "string"
    },
    filename: {
        type: "string"
    },
    meta: {
        collection: "MediaManagerMetaAP",
        via: "parent"
    },
    modelAssociation: {
        collection: "MediaManagerAssociationsAP",
        via: "file"
    },
    createdAt: {
        type: 'datetime',
        autoCreatedAt: true
    },
    updatedAt: {
        type: 'datetime',
        autoUpdatedAt: true
    }
}
