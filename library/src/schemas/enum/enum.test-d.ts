import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { enum_, type EnumIssue, type EnumSchema } from './enum.ts';

describe('enum_', () => {
  enum normalOptions {
    options1 = 'foo',
    options2 = 'bar',
    options3 = 'baz',
  }
  type NormalOptions = typeof normalOptions;
  enum abnormalOptions {
    option1 = 1.7976931348623157e308,
    option2 = 5e-324,
    option3 = 'baz',
    'Infinity' = 1,
    '-Infinity' = 2,
    'NaN' = 3,
  }
  type AbnormalOptions = typeof abnormalOptions;
  const enumLikeObject = {
    1: 'foo',
    '1.7976931348623157e+308': 'bar',
    '1.7976931348623157e308': 'baz',
    '5e-324': 'qux',
    NaN: 'NaN',
    Infinity: 'Infinity',
  } as const;
  type EnumLikeObject = typeof enumLikeObject;

  describe('should return schema object', () => {
    test('with undefined message', () => {
      type AbnormalSchema = EnumSchema<AbnormalOptions, undefined>;
      expectTypeOf(enum_(abnormalOptions)).toEqualTypeOf<AbnormalSchema>();
      expectTypeOf(
        enum_(abnormalOptions, undefined)
      ).toEqualTypeOf<AbnormalSchema>();
      type NormalSchema = EnumSchema<NormalOptions, undefined>;
      expectTypeOf(enum_(normalOptions)).toEqualTypeOf<NormalSchema>();
      expectTypeOf(
        enum_(normalOptions, undefined)
      ).toEqualTypeOf<NormalSchema>();
    });

    test('with string message', () => {
      expectTypeOf(enum_(abnormalOptions, 'message')).toEqualTypeOf<
        EnumSchema<AbnormalOptions, 'message'>
      >();
      expectTypeOf(enum_(normalOptions, 'message')).toEqualTypeOf<
        EnumSchema<NormalOptions, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(enum_(abnormalOptions, () => 'message')).toEqualTypeOf<
        EnumSchema<AbnormalOptions, () => string>
      >();
      expectTypeOf(enum_(normalOptions, () => 'message')).toEqualTypeOf<
        EnumSchema<NormalOptions, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type AbnormalSchema = EnumSchema<AbnormalOptions, undefined>;
    type NormalSchema = EnumSchema<NormalOptions, undefined>;
    type EnumLikeObjectSchema = EnumSchema<EnumLikeObject, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<AbnormalSchema>>().toEqualTypeOf<
        | abnormalOptions.option1
        | abnormalOptions.option2
        | abnormalOptions.option3
      >();
      expectTypeOf<InferInput<NormalSchema>>().toEqualTypeOf<normalOptions>;
      expectTypeOf<InferInput<EnumLikeObjectSchema>>().toEqualTypeOf<'baz'>;
    });

    test('of output', () => {
      expectTypeOf<InferOutput<AbnormalSchema>>().toEqualTypeOf<
        | abnormalOptions.option1
        | abnormalOptions.option2
        | abnormalOptions.option3
      >();
      expectTypeOf<InferOutput<NormalSchema>>().toEqualTypeOf<normalOptions>();
      expectTypeOf<InferOutput<EnumLikeObjectSchema>>().toEqualTypeOf<'baz'>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<AbnormalSchema>>().toEqualTypeOf<EnumIssue>();
      expectTypeOf<InferIssue<NormalSchema>>().toEqualTypeOf<EnumIssue>();
      expectTypeOf<
        InferIssue<EnumLikeObjectSchema>
      >().toEqualTypeOf<EnumIssue>();
    });
  });
});
