import * as v from "valibot";

const ObjectSchema1 = v.object({ foo: v.string() });
const ObjectSchema2 = v.object({ bar: v.number() });

const MergedObject = v.merge([ObjectSchema1, ObjectSchema2]);
