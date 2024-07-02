import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { literal, type LiteralIssue } from '../literal/index.ts';
import { object } from '../object/object.ts';
import { strictObject, type StrictObjectIssue } from '../strictObject/index.ts';
import type { VariantIssue } from './types.ts';
import { variant, type VariantSchema } from './variant.ts';

describe('variant', () => {
  const key = 'type' as const;
  type Key = typeof key;
  const options = [
    object({ type: literal('foo') }),
    strictObject({ type: literal('bar') }),
  ] as const;
  type Options = typeof options;

  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = VariantSchema<Key, Options, undefined>;
      expectTypeOf(variant(key, options)).toEqualTypeOf<Schema>();
      expectTypeOf(variant(key, options, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(variant(key, options, 'message')).toEqualTypeOf<
        VariantSchema<Key, Options, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(variant(key, options, () => 'message')).toEqualTypeOf<
        VariantSchema<Key, Options, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = VariantSchema<Key, Options, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        { type: 'foo' } | { type: 'bar' }
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        { type: 'foo' } | { type: 'bar' }
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        VariantIssue | StrictObjectIssue | LiteralIssue
      >();
    });
  });
});
