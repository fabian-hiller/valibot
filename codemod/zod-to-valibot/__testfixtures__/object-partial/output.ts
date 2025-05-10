import * as v from "valibot";

// make all keys optional
const Schema1 = v.object({k1: v.string(), k2: v.number(), k3: v.boolean()});
const Schema2 = v.partial(Schema1);
const Schema3 = v.partial(v.object({k1: v.string(), k2: v.number(), k3: v.boolean()}));

// make some keys optional
const Schema4 = v.object({k1: v.string(), k2: v.number(), k3: v.boolean()});
const Schema5 = v.partial(Schema4, ["k1", "k3"]);
const Schema6 = v.partial(v.object({k1: v.string(), k2: v.number(), k3: v.boolean()}), ["k2"]);
