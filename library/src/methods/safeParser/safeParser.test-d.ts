import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { object, string } from '../../schemas/index.ts';
import type { Config, InferIssue } from '../../types/index.ts';
import { pipe } from '../pipe/pipe.ts';
import type { SafeParseResult } from '../safeParse/index.ts';
import { type SafeParser, safeParser } from './safeParser.ts';

describe('safeParser', () => {
  describe('should return function object', () => {
    const schema = object({
      key: pipe(
        string(),
        transform((input) => input.length)
      ),
    });
    type Schema = typeof schema;

    test('without config', () => {
      expectTypeOf(safeParser(schema)).toEqualTypeOf<
        SafeParser<Schema, undefined>
      >();
      expectTypeOf(safeParser(schema, undefined)).toEqualTypeOf<
        SafeParser<Schema, undefined>
      >();
    });

    test('with config', () => {
      const config: Config<InferIssue<Schema>> = {
        abortEarly: true,
      };
      expectTypeOf(safeParser(schema, config)).toEqualTypeOf<
        SafeParser<Schema, typeof config>
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
    expectTypeOf(safeParser(schema)({ key: 'foo' })).toEqualTypeOf<
      SafeParseResult<typeof schema>
    >();
  });
});
