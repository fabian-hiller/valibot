import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import { array, type ArrayIssue, type ArraySchema } from './array.ts';

describe('array', () => {
  describe('should return schema array', () => {
    const item = string();
    type Item = typeof item;

    test('with undefined message', () => {
      type Schema = ArraySchema<Item, undefined>;
      expectTypeOf(array(item)).toEqualTypeOf<Schema>();
      expectTypeOf(array(item, undefined)).toEqualTypeOf<Schema>();
    });

    test('with array message', () => {
      expectTypeOf(array(item, 'message')).toEqualTypeOf<
        ArraySchema<Item, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(array(item, () => 'message')).toEqualTypeOf<
        ArraySchema<Item, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = ArraySchema<
      OptionalSchema<StringSchema<undefined>, 'foo'>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        (string | undefined)[]
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string[]>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        ArrayIssue | StringIssue
      >();
    });
  });
});
