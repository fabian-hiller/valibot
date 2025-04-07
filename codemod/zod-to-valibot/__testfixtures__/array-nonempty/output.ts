import * as v from "valibot";

const Schema1 = v.array(v.string());
const Schema2 = v.tupleWithRest([Schema1.item], Schema1.item);
const Schema3 = v.tupleWithRest([v.number()], v.number());