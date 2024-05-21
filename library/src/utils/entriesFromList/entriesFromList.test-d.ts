import { describe, expectTypeOf, test } from 'vitest';
import { string } from '../../schemas/index.ts';
import { entriesFromList } from './entriesFromList.ts';

describe('entriesFromList', () => {
  test('should return object entries', () => {
    const schema = string();
    expectTypeOf(entriesFromList(['foo', 'bar', 'baz'], schema)).toEqualTypeOf<
      Record<'foo' | 'bar' | 'baz', typeof schema>
    >();
  });
});
