import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { object, string } from '../../schemas/index.ts';
import type { Config, InferIssue } from '../../types/index.ts';
import { pipe } from '../pipe/pipe.ts';
import { type ParserAsync, parserAsync } from './parserAsync.ts';

describe('parserAsync', () => {
  describe('should return function object', () => {
    const schema = object({
      key: pipe(
        string(),
        transform((input) => input.length)
      ),
    });
    type Schema = typeof schema;

    test('without config', () => {
      expectTypeOf(parserAsync(schema)).toEqualTypeOf<
        ParserAsync<Schema, undefined>
      >();
      expectTypeOf(parserAsync(schema, undefined)).toEqualTypeOf<
        ParserAsync<Schema, undefined>
      >();
    });

    test('with config', () => {
      const config: Config<InferIssue<Schema>> = {
        abortEarly: true,
      };
      expectTypeOf(parserAsync(schema, config)).toEqualTypeOf<
        ParserAsync<Schema, typeof config>
      >();
    });
  });

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
