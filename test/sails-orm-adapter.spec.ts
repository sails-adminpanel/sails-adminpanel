// Unit tests for the Sails (Waterline) ORM adapter that bridges Adminizer's
// adapter-neutral QueryCriteria to Waterline's native criteria language.
//
// References for Waterline criteria patterns:
//   https://sailsjs.com/documentation/concepts/models-and-orm/query-language
//   https://sailsjs.com/documentation/reference/waterline-orm/queries/where
//
// Waterline operators covered here:
//   '<', '<=', '>', '>=', '!=', 'in', 'nin', 'contains', 'startsWith',
//   'endsWith', 'like', plus top-level `or` / `and` arrays.
// Waterline does NOT support: between, regex, isNull/isNotNull as keys,
// generalised NOT, or filtering by joined relation columns ($rel.field$).

import { describe, expect, it, beforeEach } from "vitest";

// The "adminizer" bare specifier inside /lib/SailsORMAdapter.js is aliased
// to a minimal stub by ../vitest.config.ts.
import { WaterlineModel, SailsORMAdapter } from "../lib/SailsORMAdapter.js";

interface MockCalls {
    find: any[];
    findOne: any[];
    count: any[];
    create: any[];
    updateOne: any[];
    update: any[];
    destroyOne: any[];
    destroy: any[];
    populate: Array<{ op: string; field: string; populateCriteria?: any }>;
}

function postAttributes() {
    return {
        id: { type: "number" },
        title: { type: "string" },
        body: { type: "string" },
        views: { type: "number" },
        published: { type: "boolean" },
        publishedAt: { type: "ref" },
        tags: { type: "json" },
        owner: { model: "User" },
        comments: { collection: "Comment", via: "post" },
    };
}

function createWaterlineModelMock(attributes: Record<string, any> = postAttributes(), primaryKey = "id") {
    const calls: MockCalls = {
        find: [],
        findOne: [],
        count: [],
        create: [],
        updateOne: [],
        update: [],
        destroyOne: [],
        destroy: [],
        populate: [],
    };

    function makeQuery(opName: string, payload: any) {
        const promise: any = Promise.resolve(payload);
        promise.populate = function (field: string, populateCriteria?: any) {
            calls.populate.push({ op: opName, field, populateCriteria });
            return this;
        };
        promise.limit = function () { return this; };
        promise.skip = function () { return this; };
        promise.sort = function () { return this; };
        return promise;
    }

    return {
        attributes,
        primaryKey,
        identity: "mocked",
        calls,
        find(criteria: any) {
            calls.find.push(criteria);
            return makeQuery("find", []);
        },
        findOne(criteria: any) {
            calls.findOne.push(criteria);
            return makeQuery("findOne", null);
        },
        count(criteria: any) {
            calls.count.push(criteria);
            return Promise.resolve(0);
        },
        create(data: any) {
            calls.create.push(data);
            return { fetch: () => Promise.resolve(data) };
        },
        updateOne(criteria: any) {
            calls.updateOne.push(criteria);
            return { set: (data: any) => Promise.resolve({ ...criteria, ...data }) };
        },
        update(criteria: any) {
            calls.update.push(criteria);
            return {
                set: (data: any) => ({
                    fetch: () => Promise.resolve([{ ...criteria, ...data }]),
                }),
            };
        },
        destroyOne(criteria: any) {
            calls.destroyOne.push(criteria);
            return Promise.resolve(null);
        },
        destroy(criteria: any) {
            calls.destroy.push(criteria);
            return { fetch: () => Promise.resolve([]) };
        },
    };
}

type MockModel = ReturnType<typeof createWaterlineModelMock>;

function buildModel(): { mock: MockModel; model: any } {
    const mock = createWaterlineModelMock();
    const model = new (WaterlineModel as any)("Post", mock);
    return { mock, model };
}

describe("SailsORMAdapter — adapter metadata", () => {
    it("registers itself with the 'sails' ormType", () => {
        const orm = { Post: createWaterlineModelMock() };
        const adapter = new (SailsORMAdapter as any)(orm);
        expect(adapter.ormType).toBe("sails");
        expect(adapter.models).toBe(orm);
        expect(adapter.getModel("Post")).toBe(orm.Post);
        expect(adapter.getAttributes("Post")).toEqual(orm.Post.attributes);
    });

    it("throws when getAttributes is called on a missing model", () => {
        const adapter = new (SailsORMAdapter as any)({});
        expect(() => adapter.getAttributes("Missing")).toThrow(/Model "Missing" was not found/);
    });
});

describe("WaterlineModel._find — pagination & sort", () => {
    let mock: MockModel;
    let model: any;

    beforeEach(() => {
        ({ mock, model } = buildModel());
    });

    it("forwards skip/limit/select/sort directly to Waterline", async () => {
        await model._find({
            where: { published: true },
            sort: "views DESC",
            limit: 10,
            skip: 20,
            select: ["id", "title", "views"],
        });

        expect(mock.calls.find[0]).toEqual({
            where: { published: true },
            sort: "views DESC",
            limit: 10,
            skip: 20,
            select: ["id", "title", "views"],
        });
    });

    it("converts an object-form sort to Waterline's 'field DIR' string", async () => {
        await model._find({ where: {}, sort: { views: "desc" } });
        expect(mock.calls.find[0].sort).toBe("views DESC");
    });

    it("drops a sort that points at an association field", async () => {
        // Waterline cannot ORDER BY a joined column — adapter must strip the sort
        // to avoid a runtime error when the WHERE is empty.
        await model._find({ where: {}, sort: "owner ASC" });
        expect(mock.calls.find[0].sort).toBeUndefined();
    });

    it("filters non-string entries out of the select list", async () => {
        await model._find({ where: {}, select: ["id", 42 as any, "title"] });
        expect(mock.calls.find[0].select).toEqual(["id", "title"]);
    });
});

describe("WaterlineModel._find — operator translation", () => {
    let mock: MockModel;
    let model: any;

    beforeEach(() => {
        ({ mock, model } = buildModel());
    });

    async function captureWhere(where: any): Promise<any> {
        await model._find({ where });
        return mock.calls.find[mock.calls.find.length - 1].where;
    }

    it("passes a primitive equality through unchanged", async () => {
        expect(await captureWhere({ title: "hello" })).toEqual({ title: "hello" });
    });

    it("maps ne → '!='", async () => {
        expect(await captureWhere({ views: { ne: 5 } })).toEqual({ views: { "!=": 5 } });
    });

    it("maps gt/gte/lt/lte → '>'/'>='/'<'/'<='", async () => {
        expect(await captureWhere({ views: { gt: 1, gte: 2, lt: 9, lte: 10 } })).toEqual({
            views: { ">": 1, ">=": 2, "<": 9, "<=": 10 },
        });
    });

    it("passes contains / startsWith / endsWith / like through unchanged", async () => {
        expect(await captureWhere({ title: { contains: "foo" } })).toEqual({ title: { contains: "foo" } });
        expect(await captureWhere({ title: { startsWith: "F" } })).toEqual({ title: { startsWith: "F" } });
        expect(await captureWhere({ title: { endsWith: "x" } })).toEqual({ title: { endsWith: "x" } });
        expect(await captureWhere({ title: { like: "f%o" } })).toEqual({ title: { like: "f%o" } });
    });

    it("maps in → in (operator object form)", async () => {
        expect(await captureWhere({ id: { in: [1, 2, 3] } })).toEqual({ id: { in: [1, 2, 3] } });
    });

    it("maps notIn → nin", async () => {
        expect(await captureWhere({ id: { notIn: [1, 2] } })).toEqual({ id: { nin: [1, 2] } });
    });

    it("converts a bare array value to { in: [...] }", async () => {
        expect(await captureWhere({ id: [1, 2, 3] })).toEqual({ id: { in: [1, 2, 3] } });
    });

    it("expands between → { '>=': lo, '<=': hi }", async () => {
        expect(await captureWhere({ views: { between: [10, 20] } })).toEqual({
            views: { ">=": 10, "<=": 20 },
        });
    });

    it("preserves null for IS NULL semantics", async () => {
        expect(await captureWhere({ publishedAt: null })).toEqual({ publishedAt: null });
    });

    it("maps { isNull: true } to plain null", async () => {
        expect(await captureWhere({ publishedAt: { isNull: true } })).toEqual({ publishedAt: null });
    });

    it("maps { isNotNull: true } → { '!=': null }", async () => {
        expect(await captureWhere({ publishedAt: { isNotNull: true } })).toEqual({
            publishedAt: { "!=": null },
        });
    });

    it("translates jsonContains to a 'contains' LIKE approximation", async () => {
        const where = await captureWhere({ tags: { jsonContains: "alpha" } });
        // Serialised value '"alpha"' is matched as LIKE '%"alpha"%'
        expect(where.tags.contains).toBe('"alpha"');
    });

    it("silently drops regex (no Waterline equivalent)", async () => {
        // Empty WHERE → adapter omits the key entirely from the criteria.
        expect(await captureWhere({ title: { regex: "^foo" } })).toBeUndefined();
    });

    it("preserves a Date value as-is", async () => {
        const d = new Date("2026-01-01T00:00:00Z");
        expect(await captureWhere({ publishedAt: d })).toEqual({ publishedAt: d });
    });

    it("collapses an empty operator object", async () => {
        const where = await captureWhere({ views: { regex: undefined } });
        expect(where).toBeUndefined();
    });

    it("ignores `undefined` values for individual fields", async () => {
        const where = await captureWhere({ title: undefined, views: 5 });
        expect(where).toEqual({ views: 5 });
    });
});

describe("WaterlineModel._find — logical groups", () => {
    let mock: MockModel;
    let model: any;

    beforeEach(() => {
        ({ mock, model } = buildModel());
    });

    async function captureWhere(where: any): Promise<any> {
        await model._find({ where });
        return mock.calls.find[mock.calls.find.length - 1].where;
    }

    it("forwards an AND group as Waterline `and`", async () => {
        const where = await captureWhere({
            and: [
                { published: true },
                { views: { gte: 100 } },
            ],
        });
        expect(where).toEqual({
            and: [
                { published: true },
                { views: { ">=": 100 } },
            ],
        });
    });

    it("forwards an OR group with operator translation inside", async () => {
        const where = await captureWhere({
            or: [
                { title: { contains: "alpha" } },
                { views: { lt: 10 } },
            ],
        });
        expect(where).toEqual({
            or: [
                { title: { contains: "alpha" } },
                { views: { "<": 10 } },
            ],
        });
    });

    it("collapses single-item AND groups", async () => {
        const where = await captureWhere({ and: [{ views: { gt: 1 } }] });
        expect(where).toEqual({ views: { ">": 1 } });
    });

    it("inverts a NOT on a single primitive equality to '!='", async () => {
        const where = await captureWhere({ not: { published: true } });
        expect(where).toEqual({ published: { "!=": true } });
    });

    it("inverts a NOT around an `in` to `nin`", async () => {
        const where = await captureWhere({ not: { id: { in: [1, 2] } } });
        expect(where).toEqual({ id: { nin: [1, 2] } });
    });

    it("inverts a NOT around null to '!=': null", async () => {
        const where = await captureWhere({ not: { publishedAt: null } });
        expect(where).toEqual({ publishedAt: { "!=": null } });
    });

    it("drops a NOT it cannot invert (multiple-key clause)", async () => {
        // Waterline lacks a general NOT — the adapter bails on inversion,
        // which produces an empty WHERE that the adapter omits entirely.
        const where = await captureWhere({
            not: { and: [{ published: true }, { views: { gt: 1 } }] },
        });
        expect(where).toBeUndefined();
    });

    it("strips $relation.field$ paths that Waterline cannot filter on", async () => {
        const where = await captureWhere({
            and: [
                { published: true },
                { "$owner.login$": "admin" },
            ],
        });
        expect(where).toEqual({ published: true });
    });
});

describe("WaterlineModel._find — populate", () => {
    let mock: MockModel;
    let model: any;

    beforeEach(() => {
        ({ mock, model } = buildModel());
    });

    it("populates all relation attributes by default", async () => {
        await model._find({ where: {} });
        const fields = mock.calls.populate.map((p) => p.field);
        expect(fields.sort()).toEqual(["comments", "owner"]);
        for (const call of mock.calls.populate) {
            expect(call.populateCriteria).toBeUndefined();
        }
    });

    it("populates only the requested relations when populate is provided", async () => {
        await model._find({ where: {}, populate: { owner: true } });
        const fields = mock.calls.populate.map((p) => p.field);
        expect(fields).toEqual(["owner"]);
    });

    it("forwards a nested criteria object for a populated relation", async () => {
        await model._find({
            where: {},
            populate: {
                comments: { where: { published: true }, sort: "createdAt DESC", limit: 5 },
            },
        });

        expect(mock.calls.populate).toHaveLength(1);
        const call = mock.calls.populate[0];
        expect(call.field).toBe("comments");
        expect(call.populateCriteria).toEqual({
            where: { published: true },
            sort: "createdAt DESC",
            limit: 5,
        });
    });

    it("ignores populate keys that are not defined on the model", async () => {
        await model._find({ where: {}, populate: { ghost: true, owner: true } });
        const fields = mock.calls.populate.map((p) => p.field);
        expect(fields).toEqual(["owner"]);
    });
});

describe("WaterlineModel — findOne / count / mutations", () => {
    let mock: MockModel;
    let model: any;

    beforeEach(() => {
        ({ mock, model } = buildModel());
    });

    it("passes a normalised criteria to findOne and populates by default", async () => {
        await model._findOne({ where: { id: 7 } });
        expect(mock.calls.findOne[0]).toEqual({ where: { id: 7 } });
        expect(mock.calls.populate.map((p) => p.field).sort()).toEqual(["comments", "owner"]);
    });

    it("passes only the converted where to count (no sort/limit/skip)", async () => {
        await model._count({
            where: { views: { gt: 5 } },
            sort: "views DESC",
            limit: 10,
            skip: 0,
        });
        expect(mock.calls.count[0]).toEqual({ views: { ">": 5 } });
    });

    it("converts criteria when calling updateOne", async () => {
        await model._updateOne({ where: { id: { in: [1, 2] } } }, { published: true });
        expect(mock.calls.updateOne[0]).toEqual({ id: { in: [1, 2] } });
    });

    it("converts criteria when calling update (many)", async () => {
        await model._update({ where: { views: { between: [10, 20] } } }, { published: true });
        expect(mock.calls.update[0]).toEqual({ views: { ">=": 10, "<=": 20 } });
    });

    it("converts criteria when calling destroyOne", async () => {
        await model._destroyOne({ where: { views: { lte: 0 } } });
        expect(mock.calls.destroyOne[0]).toEqual({ views: { "<=": 0 } });
    });

    it("converts criteria when calling destroy (many)", async () => {
        await model._destroy({ where: { published: false } });
        expect(mock.calls.destroy[0]).toEqual({ published: false });
    });

    it("passes create() data through unchanged and resolves via .fetch()", async () => {
        const data = { title: "new", views: 0 };
        const result = await model._create(data);
        expect(mock.calls.create[0]).toEqual(data);
        expect(result).toEqual(data);
    });

    it("treats criteria fields as where when no explicit `where` key is given", async () => {
        // Adminizer's QueryCriteria normally wraps conditions in `where`, but
        // we should tolerate the flat form that older callers may use.
        await model._find({ published: true, sort: "views DESC", limit: 3 });
        expect(mock.calls.find[0]).toEqual({
            where: { published: true },
            sort: "views DESC",
            limit: 3,
        });
    });
});
