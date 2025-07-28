import * as v from "valibot";

const Schema1 = v.looseObject({key: v.string()});
const Schema2 = v.looseObject({key: v.string()}, "some message");
const Schema3 = v.pipe(v.looseObject({key: v.string()}), v.description("some description"));
const Schema4 = v.object({key: v.string()});
const Schema5 = v.looseObject(Schema4.entries);