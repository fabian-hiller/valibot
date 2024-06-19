import * as v from 'valibot';

const Schema = v.object({
  normal: v.pipe(
    v.string(),
    v.email(() => 'Email required')
  ),
  union: v.pipe(
    v.union([v.pipe(v.string(), v.decimal()), v.number()]),
    v.minValue(10)
  ),
  intersection: v.intersect([
    v.object({ a: v.string() }),
    v.object({ b: v.number() }),
  ]),
  variant: v.variant('type', [
    v.object({ type: v.literal('a') }),
    v.object({ type: v.literal('b') }),
  ]),
  picklist: v.picklist(['a', 'b']),
  tuple: v.tuple([v.string(), v.number()]),
});
