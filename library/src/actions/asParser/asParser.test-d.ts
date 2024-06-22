import { describe, expectTypeOf, test } from 'vitest';
import { pipeAsync } from '../../methods/index.ts';
import { pipe } from '../../methods/pipe/pipe.ts';
import { object, objectAsync, string } from '../../schemas/index.ts';
import { transform } from '../index.ts';
import { asParser } from './asParser.ts';

describe('asParse', () => {
  test('should return output type of schema', () => {
    const schema = pipe(
      object({
        key: pipe(
          string(),
          transform((input) => input.length)
        ),
      }),
      asParser()
    );

    const schemaAsync = pipeAsync(
      objectAsync({
        key: pipe(
          string(),
          transform((input) => input.length)
        ),
      }),
      asParser()
    );
    expectTypeOf(schema.parse({ key: 'foo' })).toEqualTypeOf<{
      key: number;
    }>();

    expectTypeOf(schemaAsync.parse({ key: 'foo' })).toEqualTypeOf<
      Promise<{
        key: number;
      }>
    >();
  });
});
