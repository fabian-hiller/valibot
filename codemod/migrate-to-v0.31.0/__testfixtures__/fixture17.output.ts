import * as v from 'valibot';

const Schema1 = v.pipe(v.union([v.string(), v.number()]), v.minValue(123));
const Schema2 = v.pipe(
  v.union([v.string(), v.number()], 'error'),
  v.minValue(123)
);
