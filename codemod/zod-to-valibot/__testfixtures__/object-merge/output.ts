import * as v from "valibot";

// plain
const Schema1 = v.merge(v.object({foo: v.string()}), v.object({bar: v.number()}));
const Schema2 = v.object({foo: v.number()});
const Schema3 = v.merge(Schema2, v.object({bar: v.string()}));
const Schema4 = v.object({bar: v.number()});
const Schema5 = v.merge(v.object({foo: v.string()}), Schema4);
const Schema6 = v.merge(Schema2, Schema4);

// passthrough
const Schema7 = v.merge(v.object({foo: v.string()}), v.looseObject({bar: v.number()}));
const Schema8 = v.merge(Schema2, v.looseObject({bar: v.string()}));
const Schema9 = v.looseObject({bar: v.number()});
const Schema10 = v.merge(v.object({foo: v.string()}), Schema9);
const Schema11 = v.merge(Schema2, Schema9);

// strict
const Schema12 = v.merge(v.object({foo: v.string()}), v.strictObject({bar: v.number()}));
const Schema13 = v.merge(Schema2, v.strictObject({bar: v.string()}));
const Schema14 = v.strictObject({bar: v.number()});
const Schema15 = v.merge(v.object({foo: v.string()}), Schema14);
const Schema16 = v.merge(Schema2, Schema14);

// strip
const Schema17 = v.merge(v.object({foo: v.string()}), v.object({bar: v.number()}));
const Schema18 = v.merge(Schema2, v.object({bar: v.string()}));
const Schema19 = v.object({bar: v.number()});
const Schema20 = v.merge(v.object({foo: v.string()}), Schema19);
const Schema21 = v.merge(Schema2, Schema19);

// catchall
const Schema22 = v.merge(v.object({foo: v.string()}), v.objectWithRest({bar: v.number()}, v.null()));
const Schema23 = v.merge(Schema2, v.objectWithRest({bar: v.string()}, v.null()));
const Schema24 = v.objectWithRest({bar: v.number()}, v.null());
const Schema25 = v.merge(v.object({foo: v.string()}), Schema24);
const Schema26 = v.merge(Schema2, Schema24);

// ------------ Expected transform ------------
// // plain
// const Schema1 = v.object({...{foo: v.string()}, ...{bar: v.number()}});
// const Schema2 = v.object({foo: v.number()});
// const Schema3 = v.object({...Schema2.entries, ...{bar: v.string()}});
// const Schema4 = v.object({bar: v.number()});
// const Schema5 = v.object({...{foo: v.string()}, ...Schema4.entries});
// const Schema6 = v.object({...Schema2.entries, ...Schema4.entries});

// // passthrough
// const Schema7 = v.looseObject({...{foo: v.string()}, ...{bar: v.number()}});
// const Schema8 = v.looseObject({...Schema2.entries, ...{bar: v.string()}});
// const Schema9 = v.looseObject({bar: v.number()});
// const Schema10 = v.looseObject({...{foo: v.string()}, ...Schema9.entries});
// const Schema11 = v.looseObject({...Schema2.entries, ...Schema9.entries});

// // strict
// const Schema12 = v.strictObject({...{foo: v.string()}, ...{bar: v.number()}});
// const Schema13 = v.strictObject({...Schema2.entries, ...{bar: v.string()}});
// const Schema14 = v.strictObject({bar: v.number()});
// const Schema15 = v.strictObject({...{foo: v.string()}, ...Schema14.entries});
// const Schema16 = v.strictObject({...Schema2.entries, ...Schema14.entries});

// // strip
// const Schema17 = v.object({...{foo: v.string()}, ...{bar: v.number()}});
// const Schema18 = v.object({...Schema2.entries, ...{bar: v.string()}});
// const Schema19 = v.object({bar: v.number()});
// const Schema20 = v.object({...{foo: v.string()}, ...Schema19.entries});
// const Schema21 = v.object({...Schema2.entries, ...Schema19.entries});

// // catchall
// const Schema22 = v.objectWithRest({...{foo: v.string()}, ...{bar: v.number()}}, v.null());
// const Schema23 = v.objectWithRest({...Schema2.entries, ...{bar: v.string()}}, v.null());
// const Schema24 = v.objectWithRest({bar: v.number()}, v.null());
// const Schema25 = v.objectWithRest({...{foo: v.string()}, ...Schema24.entries}, Schema24.rest);
// const Schema26 = v.objectWithRest({...Schema2.entries, ...Schema24.entries}, Schema24.rest);