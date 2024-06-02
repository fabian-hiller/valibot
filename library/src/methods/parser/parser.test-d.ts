import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { object, string } from '../../schemas/index.ts';
import { pipe } from '../pipe/pipe.ts';
import { parser } from './parser.ts';

describe('parser', () => {
  test('should return output type of schema', () => {
    expectTypeOf(
      parser(
        object({
          key: pipe(
            string(),
            transform((input) => input.length)
          ),
        })
      )({ key: 'foo' })
    ).toEqualTypeOf<{ key: number }>();
  });
});
