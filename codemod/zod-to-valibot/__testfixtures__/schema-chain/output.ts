import * as v from "valibot";

const Schema1 = v.pipe(v.string(), v.trim(), v.email());
const output1 = v.parse(v.string(), "valibot@example.com");
const output2 = v.parse(v.pipe(v.string(), v.trim(), v.email()), "valibot@example.com");