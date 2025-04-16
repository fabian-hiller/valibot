import * as v from "valibot";

const Schema1 = v.strictObject({name: v.string(), age: v.number()});
const Schema2 = v.object({name: v.string(), age: v.number()});
const Schema3 = v.strictObject(Schema2.entries);