import * as v from 'valibot';

const Schema = v.coerce(v.date(), (input) => new Date(input));
