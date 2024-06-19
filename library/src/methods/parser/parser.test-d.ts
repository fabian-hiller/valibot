import { describe, expectTypeOf, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { object, string } from '../../schemas/index.ts';
import type { Config, InferIssue } from '../../types/index.ts';
import { pipe } from '../pipe/pipe.ts';
import { type Parser, parser } from './parser.ts';

describe('parser', () => {
  describe('should return function object', () => {
    const schema = object({
      key: pipe(
        string(),
        transform((input) => input.length)
      ),
    });
    type Schema = typeof schema;

    test('without config', () => {
      expectTypeOf(parser(schema)).toEqualTypeOf<Parser<Schema, undefined>>();
      expectTypeOf(parser(schema, undefined)).toEqualTypeOf<
        Parser<Schema, undefined>
      >();
    });

    test('with config', () => {
      const config: Config<InferIssue<Schema>> = {
        abortEarly: true,
      };
      expectTypeOf(parser(schema, config)).toEqualTypeOf<
        Parser<Schema, typeof config>
      >();
    });
  });

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
