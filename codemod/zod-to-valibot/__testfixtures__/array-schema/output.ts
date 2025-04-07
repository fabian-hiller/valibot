import * as v from "valibot";

// simple cases
const Schema1 = v.array(v.string());
const Schema2 = v.array(v.string());

// chains
const Schema3 = v.array(v.pipe(v.string(), v.email()));
const Schema4 = v.array(v.optional(v.pipe(v.string(), v.minLength(7))));
const Schema5 = v.optional(v.array(v.pipe(v.string(), v.minLength(12))));