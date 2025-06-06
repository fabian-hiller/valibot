import * as v from "valibot";

const Schema1 = v.strictObject({key: v.string()});
const Schema2 = v.strictObject({key: v.string()}, "some message");
const Schema3 = v.pipe(v.object({key: v.string()}), v.description("some description"), v.strict());
const Schema4 = v.object({key: v.string()});
const Schema5 = v.pipe(Schema4, v.strict());