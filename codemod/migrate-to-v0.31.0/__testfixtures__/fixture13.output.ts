import * as v from 'valibot';

const Schema1 = v.pipe(
  v.map(v.number(), v.pipe(v.string(), v.url(), v.endsWith('@example.com'))),
  v.maxSize(10)
);

const Schema2 = v.pipe(
  v.object({
    list: v.pipe(
      v.array(v.pipe(v.string(), v.minLength(3))),
      v.minLength(3),
      v.includes('foo')
    ),
    length: v.pipe(v.number(), v.integer()),
  }),
  v.check((input) => input.list.length === input.length)
);
