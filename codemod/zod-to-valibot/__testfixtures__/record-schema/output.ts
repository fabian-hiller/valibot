import * as v from "valibot";

const Schema1 = v.record(v.string(), v.number());
const Schema2 = v.record(v.string(), v.boolean());