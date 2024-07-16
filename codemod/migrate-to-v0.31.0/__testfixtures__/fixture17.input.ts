import * as v from 'valibot';

const Schema1 = v.union([v.string(), v.number()], [v.minValue(123)]);
const Schema2 = v.union([v.string(), v.number()], 'error', [v.minValue(123)]);
