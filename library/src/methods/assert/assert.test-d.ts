import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/pipe.ts';
import { assert } from './assert.ts';

describe('assert', () => {
  test('should assert input type of schema', () => {
    const input: unknown = { key: 'foo' };
    assert(
      object({
        key: pipe(
          string(),
          transform((input) => input.length)
        ),
      }),
      input
    );
    expectTypeOf(input).toEqualTypeOf<{ key: string }>();
  });
});
