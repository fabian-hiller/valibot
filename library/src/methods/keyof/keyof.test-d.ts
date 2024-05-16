import { describe, expectTypeOf, test } from 'vitest';
import {
  null_,
  number,
  object,
  type PicklistIssue,
  type PicklistSchema,
  string,
} from '../../schemas/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { keyof } from './keyof.ts';

describe('keyof', () => {
  const objectSchema = object({ foo: string(), bar: number(), baz: null_() });
  type Options = ['foo', 'bar', 'baz'];

  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = PicklistSchema<Options, undefined>;
      expectTypeOf(keyof(objectSchema)).toEqualTypeOf<Schema>();
      expectTypeOf(keyof(objectSchema, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(keyof(objectSchema, 'message')).toEqualTypeOf<
        PicklistSchema<Options, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(keyof(objectSchema, () => 'message')).toEqualTypeOf<
        PicklistSchema<Options, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    const schema = keyof(objectSchema);
    type Schema = typeof schema;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<'foo' | 'bar' | 'baz'>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        'foo' | 'bar' | 'baz'
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PicklistIssue>();
    });
  });
});
