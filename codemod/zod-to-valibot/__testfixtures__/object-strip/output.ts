import * as v from "valibot";

const Schema1 = v.object({name: v.string(), age: v.number()});
const Schema2 = v.strictObject({name: v.string(), age: v.number()});
const Schema3 = v.object(Schema2.entries);