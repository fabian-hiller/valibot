import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/pipe.ts';
import { is } from './is.ts';

describe('is', () => {
  const input: unknown = { key: 'foo' };
  const isValid = is(
    object({
      key: pipe(
        string(),
        transform((input) => input.length)
      ),
    }),
    input
  );

  test('should infer input type for valid input', () => {
    if (isValid) {
      expectTypeOf(input).toEqualTypeOf<{ key: string }>();
    }
  });

  test('should not infer input type for invalid input', () => {
    if (!isValid) {
      expectTypeOf(input).toEqualTypeOf<unknown>();
    }
  });
});
