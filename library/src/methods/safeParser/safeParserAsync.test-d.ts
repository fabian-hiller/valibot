import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { object, string } from '../../schemas/index.ts';
import type { Config, InferIssue } from '../../types/index.ts';
import { pipe } from '../pipe/pipe.ts';
import type { SafeParseResult } from '../safeParse/index.ts';
import { type SafeParserAsync, safeParserAsync } from './safeParserAsync.ts';

describe('safeParserAsync', () => {
  describe('should return function object', () => {
    const schema = object({
      key: pipe(
        string(),
        transform((input) => input.length)
      ),
    });
    type Schema = typeof schema;

    test('without config', () => {
      expectTypeOf(safeParserAsync(schema)).toEqualTypeOf<
        SafeParserAsync<Schema, undefined>
      >();
      expectTypeOf(safeParserAsync(schema, undefined)).toEqualTypeOf<
        SafeParserAsync<Schema, undefined>
      >();
    });

    test('with config', () => {
      const config: Omit<Config<InferIssue<Schema>>, 'skipPipe'> = {
        abortEarly: true,
      };
      expectTypeOf(safeParserAsync(schema, config)).toEqualTypeOf<
        SafeParserAsync<Schema, typeof config>
      >();
    });
  });

  test('should return safe parse result', () => {
    const schema = object({
      key: pipe(
        string(),
        transform((input) => input.length)
      ),
    });
    expectTypeOf(safeParserAsync(schema)({ key: 'foo' })).toEqualTypeOf<
      Promise<SafeParseResult<typeof schema>>
    >();
  });
});
