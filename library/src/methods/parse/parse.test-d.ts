import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/pipe.ts';
import { parse } from './parse.ts';

describe('parse', () => {
  test('should return output type of schema', () => {
    expectTypeOf(
      parse(
        object({
          key: pipe(
            string(),
            transform((input) => input.length)
          ),
        }),
        { key: 'foo' }
      )
    ).toEqualTypeOf<{ key: number }>();
  });
});
