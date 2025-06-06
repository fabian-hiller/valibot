import * as v from "valibot";

const Schema1 = v.looseObject({key: v.string()});
const Schema2 = v.looseObject({key: v.string()}, "some message");
const Schema3 = v.pipe(
  v.object({key: v.string()}),
  v.description("some description"),
  v.passthrough()
);
const Schema4 = v.object({key: v.string()});
const Schema5 = v.pipe(Schema4, v.passthrough());