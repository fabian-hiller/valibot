import * as v from "valibot";

const Schema1 = v.strictObject({key: v.string()});
const Schema2 = v.strictObject({key: v.string()}, "some message");
const Schema3 = v.strictObject(
  v.pipe(v.object({key: v.string()}), v.description("some description")).entries
);
const Schema4 = v.object({key: v.string()});
const Schema5 = v.strictObject(Schema4.entries);