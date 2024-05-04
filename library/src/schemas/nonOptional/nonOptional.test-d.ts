import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { nullish, type NullishSchema } from '../nullish/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { nonOptional, type NonOptionalSchema } from './nonOptional.ts';
import type { NonOptionalIssue } from './types.ts';

describe('nonOptional', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = NonOptionalSchema<
        NullishSchema<StringSchema<undefined>, undefined>,
        undefined
      >;
      expectTypeOf(nonOptional(nullish(string()))).toEqualTypeOf<Schema>();
      expectTypeOf(
        nonOptional(nullish(string()), undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(nonOptional(nullish(string()), 'message')).toEqualTypeOf<
        NonOptionalSchema<
          NullishSchema<StringSchema<undefined>, undefined>,
          'message'
        >
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        nonOptional(nullish(string()), () => 'message')
      ).toEqualTypeOf<
        NonOptionalSchema<
          NullishSchema<StringSchema<undefined>, undefined>,
          () => string
        >
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = NonOptionalSchema<
      NullishSchema<StringSchema<undefined>, undefined>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<string | null>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string | null>();
    });

    // TODO: Add test with union schema to make sure `UndefinedIssue` are not
    // included
    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        NonOptionalIssue | StringIssue
      >();
    });
  });
});
