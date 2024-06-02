import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/pipe.ts';
import { parserAsync } from './parserAsync.ts';

describe('parserAsync', () => {
  test('should return output type of schema', () => {
    expectTypeOf(
      parserAsync(
        object({
          key: pipe(
            string(),
            transform((input) => input.length)
          ),
        })
      )({ key: 'foo' })
    ).toEqualTypeOf<Promise<{ key: number }>>();
  });
});
