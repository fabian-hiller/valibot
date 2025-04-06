import * as v from "valibot";

const Schema1 = v.object({
	...v.object({foo: v.string()}).entries,
	...{bar: v.number()}
});

const Schema2 = v.object({foo: v.number()});
const Schema3 = v.object({
	...Schema2.entries,
	...{bar: v.string()}
});

const Obj1 = {bar: v.boolean()};
const Schema5 = v.object({...v.object({foo: v.bigint()}).entries, ...Obj1});

const Schema6 = v.object({foo: v.unknown()});
const Obj3 = {bar: v.null()};
const Schema7 = v.object({...Schema6.entries, ...Obj3});
