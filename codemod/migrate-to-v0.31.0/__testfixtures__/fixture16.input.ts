import * as v from 'valibot';

const flatErrors1 = v.flatten(error);
const flatErrors2 = v.flatten([issue]);
const flatErrors3 = v.flatten(result.issues);
