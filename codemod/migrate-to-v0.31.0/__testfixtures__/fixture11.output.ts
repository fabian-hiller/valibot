import * as v from 'valibot';

const Schema = v.pipe(
  v.object({
    name: v.string(),
    age: v.number(),
  }),
  v.forward(
    v.check((i) => i.age > 18, 'You must be over 18'),
    ['age']
  )
);
