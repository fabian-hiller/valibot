import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  picklist,
  type PicklistIssue,
  type PicklistSchema,
} from './picklist.ts';

describe('picklist', () => {
  const options = ['foo', 'bar'] as const;
  type Options = typeof options;

  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = PicklistSchema<Options, undefined>;
      expectTypeOf(picklist(options)).toEqualTypeOf<Schema>();
      expectTypeOf(picklist(options, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(picklist(options, 'message')).toEqualTypeOf<
        PicklistSchema<Options, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(picklist(options, () => 'message')).toEqualTypeOf<
        PicklistSchema<Options, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = PicklistSchema<Options, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<'foo' | 'bar'>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<'foo' | 'bar'>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<PicklistIssue>();
    });
  });
});
