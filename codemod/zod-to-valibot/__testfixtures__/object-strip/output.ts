import * as v from "valibot";

// passthrough
const Schema1 = v.object({key: v.string()});
const Schema2 = v.object({key: v.string()}, "some message");
const Schema3 = v.pipe(
  v.object({key: v.string()}),
  v.description("some description"),
  v.passthrough(),
  v.strip()
);
const Schema4 = v.looseObject({key: v.string()});
const Schema5 = v.pipe(Schema4, v.strip());
const Schema6 = v.object({key: v.string()});
const Schema7 = v.pipe(Schema6, v.passthrough(), v.strip());

// strict
const Schema8 = v.object({key: v.string()});
const Schema9 = v.object({key: v.string()}, "some message");
const Schema10 = v.object(
  v.pipe(v.object({key: v.string()}), v.description("some description")).entries
);
const Schema11 = v.strictObject({key: v.string()});
const Schema12 = v.pipe(Schema11, v.strip());
const Schema13 = v.object({key: v.string()});
const Schema14 = v.object(Schema13.entries);