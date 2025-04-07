import * as v from "valibot";

const Schema1 = v.array(v.string());
const Schema2 = Schema1.item;
const Schema3 = v.array(v.number()).item;
