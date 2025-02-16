import * as v from 'valibot';

const Schema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

const result = v.safeParse(Schema, {
  email: 'jane@example.com',
  password: '12345678',
});

console.log(result);
