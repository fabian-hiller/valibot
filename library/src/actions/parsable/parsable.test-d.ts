import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { pipe } from '../../methods/pipe/pipe.ts';
import { object, string } from '../../schemas/index.ts';
import { parsable } from './parsable.ts';

describe('parsable', () => {
  test('should return output type of schema', () => {
    const parsableSchema = pipe(
      object({
        key: pipe(
          string(),
          transform((input) => input.length)
        ),
      }),
      parsable()
    );
    expectTypeOf(parsableSchema.parse({ key: 'foo' })).toEqualTypeOf<{
      key: number;
    }>();
  });
});
