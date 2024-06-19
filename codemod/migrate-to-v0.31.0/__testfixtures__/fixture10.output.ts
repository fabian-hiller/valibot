import * as v from 'valibot';

const Schema = v.pipe(
  v.string(),
  v.brand('Name'),
  v.transform((input) => input.length)
);
