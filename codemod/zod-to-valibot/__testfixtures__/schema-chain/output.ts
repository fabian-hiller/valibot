import * as v from "valibot";

const EmailSchema = v.pipe(v.string(), v.trim(), v.email());