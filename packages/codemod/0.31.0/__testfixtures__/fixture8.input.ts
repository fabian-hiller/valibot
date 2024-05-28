import * as v from "valibot";

const Schema = v.string([v.toTrimmed(), v.url()]);
