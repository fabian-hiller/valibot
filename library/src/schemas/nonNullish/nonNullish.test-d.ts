import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { nullish, type NullishSchema } from '../nullish/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { nonNullish, type NonNullishSchema } from './nonNullish.ts';
import type { NonNullishIssue } from './types.ts';

describe('nonNullish', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NonNullishSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        undefined
      >;
      expectTypeOf(nonNullish(nullish(string()))).toEqualTypeOf<Schema>();
      expectTypeOf(
        nonNullish(nullish(string()), undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(nonNullish(nullish(string()), 'message')).toEqualTypeOf<
        NonNullishSchema<
          NullishSchema<StringSchema<undefined>, undefined>,
          'message'
        >
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        nonNullish(nullish(string()), () => 'message')
      ).toEqualTypeOf<
        NonNullishSchema<
          NullishSchema<StringSchema<undefined>, undefined>,
          () => string
        >
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NonNullishSchema<
      NullishSchema<StringSchema<undefined>, undefined>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string>();
    });

    // TODO: Add test with union schema to make sure `NullIssue` and
    // `UndefinedIssue` are not included
    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        NonNullishIssue | StringIssue
      >();
    });
  });
});
