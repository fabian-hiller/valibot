import * as v from "valibot";

const Schema = v.transform(
  v.brand(v.string(), "Name"),
  (input) => input.length,
);
