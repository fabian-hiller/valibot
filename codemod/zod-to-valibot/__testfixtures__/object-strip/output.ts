import * as v from "valibot";

const Schema1 = v.object(v.strictObject(v.object({name: v.string(), age: v.number()}).entries).entries);
const Schema2 = v.strictObject(v.object({name: v.string(), age: v.number()}).entries);
const Schema3 = v.object(Schema2.entries); 