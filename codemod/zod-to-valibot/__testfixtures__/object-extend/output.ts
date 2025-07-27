import * as v from "valibot";

// plain
const Schema1 = v.extend(v.object({foo: v.string()}), {bar: v.number()});
const Schema2 = v.object({foo: v.number()});
const Schema3 = v.extend(Schema2, {bar: v.string()});

// passthrough
const Schema4 = v.extend(v.looseObject({foo: v.string()}), {bar: v.number()});
const Schema5 = v.looseObject({foo: v.number()});
const Schema6 = v.extend(Schema5, {bar: v.string()});
const Schema7 = v.pipe(v.extend(v.object({foo: v.string()}), {bar: v.number()}), v.passthrough());
const Schema8 = v.pipe(v.extend(Schema2, {bar: v.string()}), v.passthrough());

// strict
const Schema9 = v.extend(v.strictObject({foo: v.string()}), {bar: v.number()});
const Schema10 = v.strictObject({foo: v.number()});
const Schema11 = v.extend(Schema10, {bar: v.string()});
const Schema12 = v.strictObject(v.extend(v.object({foo: v.string()}), {bar: v.number()}).entries);
const Schema13 = v.strictObject(v.extend(Schema2, {bar: v.string()}).entries);

// strip
const Schema14 = v.extend(v.object({foo: v.string()}), {bar: v.number()});
const Schema15 = v.object({foo: v.number()});
const Schema16 = v.extend(Schema15, {bar: v.string()});
const Schema17 = v.object(v.extend(v.object({foo: v.string()}), {bar: v.number()}).entries);
const Schema18 = v.object(v.extend(Schema2, {bar: v.string()}).entries);

// catchall
const Schema19 = v.extend(v.objectWithRest({foo: v.string()}, v.null()), {bar: v.number()});
const Schema20 = v.objectWithRest({foo: v.number()}, v.null());
const Schema21 = v.extend(Schema20, {bar: v.string()});
const Schema22 = v.pipe(
  v.extend(v.object({foo: v.string()}), {bar: v.number()}),
  v.catchall(v.null())
);
const Schema23 = v.pipe(v.extend(Schema2, {bar: v.string()}), v.catchall(v.null()));

// ------------ Expected transform ------------
// // plain
// const Schema1 = v.object({...{foo: v.string()}, ...{bar: v.number()}});
// const Schema2 = v.object({foo: v.number()});
// const Schema3 = v.object({...Schema2.entries, ...{bar: v.string()}});

// // passthrough
// const Schema4 = v.looseObject({...{foo: v.string()}, ...{bar: v.number()}});
// const Schema5 = v.looseObject({foo: v.number()});
// const Schema6 = v.looseObject({...Schema5.entries, ...{bar: v.string()}});
// const Schema7 = v.looseObject({...{foo: v.string()}, ...{bar: v.number()}});
// const Schema8 = v.looseObject({...Schema2.entries, ...{bar: v.string()}});

// // strict
// const Schema9 = v.strictObject({...{foo: v.string()}, ...{bar: v.number()}});
// const Schema10 = v.strictObject({foo: v.number()});
// const Schema11 = v.strictObject({...Schema10.entries, ...{bar: v.string()}});
// const Schema12 = v.strictObject({...{foo: v.string()}, ...{bar: v.number()}});
// const Schema13 = v.strictObject({...Schema2.entries, ...{bar: v.string()}});

// // strip
// const Schema14 = v.object({...{foo: v.string()}, ...{bar: v.number()}});
// const Schema15 = v.object({foo: v.number()});
// const Schema16 = v.object({...Schema15.entries, ...{bar: v.string()}});
// const Schema17 = v.object({...{foo: v.string()}, ...{bar: v.number()}});
// const Schema18 = v.object({...Schema2.entries, ...{bar: v.string()}});

// // catchall
// const Schema19 = v.objectWithRest({...{foo: v.string()}, ...{bar: v.number()}}, v.null());
// const Schema20 = v.objectWithRest({foo: v.number()}, v.null());
// const Schema21 = v.objectWithRest({...Schema20.entries, ...{bar: v.string()}}, Schema20.rest);
// const Schema22 = v.objectWithRest({...{foo: v.string()}, ...{bar: v.number()}}, v.null());
// const Schema23 = v.objectWithRest({...Schema2.entries, ...{bar: v.string()}}, v.null());