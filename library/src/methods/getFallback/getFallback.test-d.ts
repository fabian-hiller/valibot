import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { number, object, string } from '../../schemas/index.ts';
import { fallback, fallbackAsync } from '../fallback/index.ts';
import { pipe } from '../pipe/index.ts';
import { getFallback } from './getFallback.ts';

describe('getFallback', () => {
  test('should return undefined', () => {
    expectTypeOf(getFallback(string())).toEqualTypeOf<undefined>();
    expectTypeOf(getFallback(number())).toEqualTypeOf<undefined>();
    expectTypeOf(getFallback(object({}))).toEqualTypeOf<undefined>();
  });

  describe('should return fallback', () => {
    const schema = pipe(string(), transform(parseInt));

    test('for direct value', () => {
      expectTypeOf(
        getFallback(fallback(schema, 123 as const))
      ).toEqualTypeOf<123>();
    });

    test('for value getter', () => {
      expectTypeOf(
        getFallback(fallback(schema, () => 123 as const))
      ).toEqualTypeOf<123>();
    });

    test('for async value getter', () => {
      expectTypeOf(
        getFallback(fallbackAsync(schema, async () => 123 as const))
      ).toEqualTypeOf<Promise<123>>();
    });
  });
});
