import { describe, expectTypeOf, test } from 'vitest';
import { pipe } from '../../methods/pipe/pipe.ts';
import { object, string } from '../../schemas/index.ts';
import { withDescription } from './withDescription.ts';

describe('withDescription', () => {
  test('should return output type of schema', () => {
    const schema = pipe(
      object({
        key: string(),
      }),
      withDescription('some Description')
    );
    expectTypeOf<
      (typeof schema)['description']
    >().toEqualTypeOf<'some Description'>();
  });
});
