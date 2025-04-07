import * as v from "valibot";

const Schema1 = v.tuple([v.string(), v.number(), v.boolean()]);

const Schema2 = v.tupleWithRest([v.string(), v.number(), v.boolean()], v.bigint());