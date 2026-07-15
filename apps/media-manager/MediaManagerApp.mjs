import {
    AbstractAdminizerApp
} from "adminizer";
import {DefaultMediaManager} from "./DefaultMediaManager.mjs";
import {mediaManagerModelNames} from  "./DefaultMediaManager.mjs"


export class MediaManagerApp extends AbstractAdminizerApp {
    name = "media-manager";
    version = "1.0.0";
    config;

    constructor(config) {
        super();
        this.config = {
            ...config,
            id: config.id ?? "default",
            urlPathPrefix: config.urlPathPrefix ?? "media-manager",
        };
    }

    setup(ctx) {
        const permissionToken = `mediaManager-${this.config.id}`;

        ctx.accessRight({
            id: permissionToken,
            name: this.config.id,
            description: `Access to edit media-manager for ${this.config.id}`,
            department: "media-manager",
        });

        for (const modelName of Object.values(mediaManagerModelNames)) {
            ctx.model({name: modelName, adapter: "sails"});
        }

        ctx.modelAccess({
            id: "storage",
            models: Object.values(mediaManagerModelNames),
        });

        ctx.mediaManager({
            factory: (runtime) =>
                new DefaultMediaManager(
                    runtime,
                    this.config.id,
                    this.config.urlPathPrefix,
                    this.config.fileStoragePath,
                    this.config.imageSizes ?? {}
                ),
        });
    }
}
