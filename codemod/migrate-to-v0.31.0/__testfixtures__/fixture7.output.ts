import * as v from 'valibot';

const BrandedSchema = v.pipe(v.string(), v.brand('foo'));
const TransformedSchema = v.pipe(
  v.string(),
  v.transform((input) => input.length)
);
