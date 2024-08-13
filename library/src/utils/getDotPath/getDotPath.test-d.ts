import { assert, describe, expectTypeOf, test } from 'vitest';
import { safeParse } from '../../methods/index.ts';
import { number, object, string, tuple } from '../../schemas/index.ts';
import { getDotPath } from './getDotPath.ts';

describe('getDotPath', () => {
  test('should infer correct dot path type', () => {
    const schema = object({ foo: tuple([string(), number()]) });
    const issue = safeParse(schema, {}).issues?.[0];
    assert(issue !== undefined);
    expectTypeOf(getDotPath<typeof schema>(issue)).toEqualTypeOf<
      'foo' | 'foo.0' | 'foo.1' | null
    >();
  });
});
