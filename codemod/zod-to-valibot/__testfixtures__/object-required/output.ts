import * as v from "valibot";

// make all keys required
const Schema1 = v.partial(v.object({k1: v.string(), k2: v.number(), k3: v.boolean()}));
const Schema2 = v.required(Schema1);
const Schema3 = v.required(v.partial(v.object({k1: v.string(), k2: v.number(), k3: v.boolean()})));

// make some keys required
const Schema4 = v.partial(v.object({k1: v.string(), k2: v.number(), k3: v.boolean()}));
const Schema5 = v.required(Schema4, ["k1", "k3"]);
const Schema6 = v.required(v.partial(v.object({k1: v.string(), k2: v.number(), k3: v.boolean()})), ["k2"]);
