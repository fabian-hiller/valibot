import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { string, type StringIssue, type StringSchema } from './string.ts';

describe('string', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = StringSchema<undefined>;
      expectTypeOf(string()).toEqualTypeOf<Schema>();
      expectTypeOf(string(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(string('message')).toEqualTypeOf<StringSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(string(() => 'message')).toEqualTypeOf<
        StringSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = StringSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<StringIssue>();
    });
  });
});
