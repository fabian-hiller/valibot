import * as v from "valibot";

// plain
const Schema1 = v.object({...{foo: v.string()}, ...{bar: v.number()}});
const Schema2 = v.object({foo: v.number()});
const Schema3 = v.object({...Schema2.entries, ...{bar: v.string()}});
const Schema4 = v.object({bar: v.number()});
const Schema5 = v.object({...{foo: v.string()}, ...Schema4.entries});
const Schema6 = v.object({...Schema2.entries, ...Schema4.entries});

// passthrough
const Schema7 = v.looseObject({...{foo: v.string()}, ...{bar: v.number()}});
const Schema8 = v.looseObject({...Schema2.entries, ...{bar: v.string()}});
const Schema9 = v.looseObject({bar: v.number()});
const Schema10 = v.looseObject({...{foo: v.string()}, ...Schema9.entries});
const Schema11 = v.looseObject({...Schema2.entries, ...Schema9.entries});

// strict
const Schema12 = v.strictObject({...{foo: v.string()}, ...{bar: v.number()}});
const Schema13 = v.strictObject({...Schema2.entries, ...{bar: v.string()}});
const Schema14 = v.strictObject({bar: v.number()});
const Schema15 = v.strictObject({...{foo: v.string()}, ...Schema14.entries});
const Schema16 = v.strictObject({...Schema2.entries, ...Schema14.entries});

// strict
const Schema17 = v.object({...{foo: v.string()}, ...{bar: v.number()}});
const Schema18 = v.object({...Schema2.entries, ...{bar: v.string()}});
const Schema19 = v.object({bar: v.number()});
const Schema20 = v.object({...{foo: v.string()}, ...Schema19.entries});
const Schema21 = v.object({...Schema2.entries, ...Schema19.entries});

// catchall
const Schema22 = v.objectWithRest({...{foo: v.string()}, ...{bar: v.number()}}, v.null());
const Schema23 = v.objectWithRest({...Schema2.entries, ...{bar: v.string()}}, v.null());
const Schema24 = v.objectWithRest({bar: v.number()}, v.null());
const Schema25 = v.objectWithRest({...{foo: v.string()}, ...Schema24.entries}, Schema24.rest);
const Schema26 = v.objectWithRest({...Schema2.entries, ...Schema24.entries}, Schema24.rest);