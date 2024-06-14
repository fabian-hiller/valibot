import { describe, expectTypeOf, test } from 'vitest';
import { pipe } from '../../methods/pipe/pipe.ts';
import { object, string } from '../../schemas/index.ts';
import { transform } from '../index.ts';
import { withParse } from './withParse.ts';

describe('withParse', () => {
  test('should return output type of schema', () => {
    const parsableSchema = pipe(
      object({
        key: pipe(
          string(),
          transform((input) => input.length)
        ),
      }),
      withParse()
    );
    expectTypeOf(parsableSchema.parse({ key: 'foo' })).toEqualTypeOf<{
      key: number;
    }>();
  });
});
