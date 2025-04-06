import * as v from "valibot";

const Schema1 = v.objectWithRest(v.object({k1: v.string(), k2: v.number()}).entries, v.null());
const Schema2 = v.object({k1: v.string(), k2: v.number()});
const Schema3 = v.objectWithRest(Schema2.entries, v.null());