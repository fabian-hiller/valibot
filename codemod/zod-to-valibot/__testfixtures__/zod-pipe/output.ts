import * as v from "valibot";

const Schema = v.pipe(v.string(), v.transform((val) => val.length), v.number(), v.minValue(12));