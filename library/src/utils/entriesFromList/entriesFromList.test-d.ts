import { describe, expectTypeOf, test } from 'vitest';
import { arrayAsync, string } from '../../schemas/index.ts';
import { entriesFromList } from './entriesFromList.ts';

describe('entriesFromList', () => {
  describe('should return object entries', () => {
    const symbol = Symbol();

    test('for sync schemas', () => {
      const schema = string();
      expectTypeOf(entriesFromList(['foo', 123, symbol], schema)).toEqualTypeOf<
        Record<'foo' | 123 | typeof symbol, typeof schema>
      >();
    });

    test('for async schemas', () => {
      const schema = arrayAsync(string());
      expectTypeOf(entriesFromList(['foo', 123, symbol], schema)).toEqualTypeOf<
        Record<'foo' | 123 | typeof symbol, typeof schema>
      >();
    });
  });
});
