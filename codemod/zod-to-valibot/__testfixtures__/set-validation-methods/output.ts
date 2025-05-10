import * as v from "valibot";

const Schema1 = v.pipe(v.set(v.string()), v.minSize(1));
const Schema2 = v.pipe(v.set(v.string()), v.minSize(5));
const Schema3 = v.pipe(v.set(v.string()), v.maxSize(6));
const Schema4 = v.pipe(v.set(v.string()), v.size(7));