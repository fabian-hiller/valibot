import * as v from "valibot";

const Schema1 = v.looseObject({name: v.string(), age: v.number()});
const Schema2 = v.object({name: v.string(), age: v.number()});
const Schema3 = v.looseObject(Schema2.entries); 