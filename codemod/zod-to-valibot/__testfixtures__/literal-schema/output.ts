import * as v from "valibot";

const Schema1 = v.literal("valibot");
const Schema2 = v.literal(123);
const Schema3 = v.literal(Symbol("someSymbol"));
const Schema4 = v.literal(321n);
const Schema5 = v.literal(true);
const Schema6 = v.null();
const Schema7 = v.undefined();