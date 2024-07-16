import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { enum_, type EnumIssue, type EnumSchema } from './enum.ts';

describe('enum_', () => {
  enum options {
    option1 = 'foo',
    option2 = 'bar',
    option3 = 'baz',
  }
  type Options = typeof options;

  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = EnumSchema<Options, undefined>;
      expectTypeOf(enum_(options)).toEqualTypeOf<Schema>();
      expectTypeOf(enum_(options, undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(enum_(options, 'message')).toEqualTypeOf<
        EnumSchema<Options, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(enum_(options, () => 'message')).toEqualTypeOf<
        EnumSchema<Options, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = EnumSchema<Options, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<options>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<options>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<EnumIssue>();
    });
  });
});
