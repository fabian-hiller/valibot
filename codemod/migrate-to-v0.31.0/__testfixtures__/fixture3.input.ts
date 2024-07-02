import * as v from 'valibot';

v.object({
  email: v.string([v.email(), v.endsWith('@gmail.com')]),
  password: v.string([v.minLength(8)]),
  other: v.union([v.string([v.decimal()]), v.number()]),
});
