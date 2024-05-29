import * as v from "valibot";

v.object({
  email: v.pipe(v.string(), v.email(), v.endsWith("@gmail.com")),
  password: v.pipe(v.string(), v.minLength(8)),
  other: v.union([v.pipe(v.string(), v.decimal()), v.number()]),
});
