import * as v from 'valibot';

const BrandedSchema = v.brand(v.string(), 'foo');
const TransformedSchema = v.transform(v.string(), (input) => input.length);
