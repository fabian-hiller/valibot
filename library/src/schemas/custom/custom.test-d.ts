import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { custom, type CustomSchema } from './custom.ts';
import type { CustomIssue } from './types.ts';

describe('custom', () => {
  type PixelString = `${number}px`;
  const isPixelString = (input: unknown) =>
    typeof input === 'string' && /^\d+px$/u.test(input);

  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = CustomSchema<PixelString, undefined>;
      expectTypeOf(custom<PixelString>(isPixelString)).toEqualTypeOf<Schema>();
      expectTypeOf(
        custom<PixelString, undefined>(isPixelString, undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(
        custom<PixelString, 'message'>(isPixelString, 'message')
      ).toEqualTypeOf<CustomSchema<PixelString, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        custom<PixelString, () => string>(isPixelString, () => 'message')
      ).toEqualTypeOf<CustomSchema<PixelString, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = CustomSchema<PixelString, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<PixelString>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<PixelString>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<CustomIssue>();
    });
  });
});
