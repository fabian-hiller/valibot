import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { string, type StringIssue, type StringSchema } from './string.ts';

describe('string', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      expectTypeOf(string()).toEqualTypeOf<StringSchema<undefined>>();
      expectTypeOf(string(undefined)).toEqualTypeOf<StringSchema<undefined>>();
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
