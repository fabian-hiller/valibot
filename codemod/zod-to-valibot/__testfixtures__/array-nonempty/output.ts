import * as v from "valibot";

const Schema1 = v.array(v.string());
const Schema2 = v.tupleWithRest([Schema1.item], Schema1.item);
const Schema3 = v.tupleWithRest([v.number()], v.number());
const Schema4 = v.tupleWithRest([v.boolean()], v.boolean(), "cannot be empty");
const Schema5 = v.tupleWithRest([v.null()], v.null());
const Schema6 = v.tupleWithRest([v.unknown()], v.unknown(), "Cannot be empty.");