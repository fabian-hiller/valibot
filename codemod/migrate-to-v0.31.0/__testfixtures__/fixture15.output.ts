import * as v from 'valibot';

const Schema = v.pipe(
  v.unknown(),
  v.transform((input) => new Date(input))
);
