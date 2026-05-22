// Minimal stub of the "adminizer" public package surface, used by tests
// that import /lib/SailsORMAdapter.js (which has `import { ... } from "adminizer"`).
//
// Only the classes consumed by the adapter under test are stubbed here.
// Keep this file dependency-free.

export class AbstractModel {
    public readonly modelname: string;
    public readonly attributes: Record<string, any>;
    public readonly primaryKey: string;
    public readonly identity: string;

    constructor(modelname: string, attributes: Record<string, any>, primaryKey: string, identity: string) {
        this.modelname = modelname;
        this.attributes = attributes;
        this.primaryKey = primaryKey;
        this.identity = identity;
    }
}

export class AbstractAdapter {
    public readonly ormType: string;
    public readonly orm: any;

    constructor(type: string, orm: any) {
        this.ormType = type;
        this.orm = orm;
    }
}
