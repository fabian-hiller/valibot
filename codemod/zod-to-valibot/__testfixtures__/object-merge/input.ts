import { z } from "zod";

// plain
const Schema1 = z.object({foo: z.string()}).merge(z.object({bar: z.number()}));
const Schema2 = z.object({foo: z.number()});
const Schema3 = Schema2.merge(z.object({bar: z.string()}));
const Schema4 = z.object({bar: z.number()});
const Schema5 = z.object({foo: z.string()}).merge(Schema4);
const Schema6 = Schema2.merge(Schema4);

// passthrough
const Schema7 = z.object({foo: z.string()}).merge(z.object({bar: z.number()}).passthrough());
const Schema8 = Schema2.merge(z.object({bar: z.string()}).passthrough());
const Schema9 = z.object({bar: z.number()}).passthrough();
const Schema10 = z.object({foo: z.string()}).merge(Schema9);
const Schema11 = Schema2.merge(Schema9);

// strict
const Schema12 = z.object({foo: z.string()}).merge(z.object({bar: z.number()}).strict());
const Schema13 = Schema2.merge(z.object({bar: z.string()}).strict());
const Schema14 = z.object({bar: z.number()}).strict();
const Schema15 = z.object({foo: z.string()}).merge(Schema14);
const Schema16 = Schema2.merge(Schema14);

// strip
const Schema17 = z.object({foo: z.string()}).merge(z.object({bar: z.number()}).strict().strip());
const Schema18 = Schema2.merge(z.object({bar: z.string()}).strict().strip());
const Schema19 = z.object({bar: z.number()}).strict().strip();
const Schema20 = z.object({foo: z.string()}).merge(Schema19);
const Schema21 = Schema2.merge(Schema19);

// catchall
const Schema22 = z.object({foo: z.string()}).merge(z.object({bar: z.number()}).catchall(z.null()));
const Schema23 = Schema2.merge(z.object({bar: z.string()}).catchall(z.null()));
const Schema24 = z.object({bar: z.number()}).catchall(z.null());
const Schema25 = z.object({foo: z.string()}).merge(Schema24);
const Schema26 = Schema2.merge(Schema24);

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