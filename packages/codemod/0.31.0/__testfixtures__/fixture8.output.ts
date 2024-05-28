import * as v from "valibot";

const Schema = v.pipe(v.string(), v.trim(), v.url());
