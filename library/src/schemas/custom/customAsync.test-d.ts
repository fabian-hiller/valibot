import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { customAsync, type CustomSchemaAsync } from './customAsync.ts';
import type { CustomIssue } from './types.ts';

describe('customAsync', () => {
  type PixelString = `${number}px`;
  const isPixelString = async (input: unknown) =>
    typeof input === 'string' && /^\d+px$/u.test(input);

  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = CustomSchemaAsync<PixelString, undefined>;
      expectTypeOf(
        customAsync<PixelString>(isPixelString)
      ).toEqualTypeOf<Schema>();
      expectTypeOf(
        customAsync<PixelString, undefined>(isPixelString, undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(
        customAsync<PixelString, 'message'>(isPixelString, 'message')
      ).toEqualTypeOf<CustomSchemaAsync<PixelString, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        customAsync<PixelString, () => string>(isPixelString, () => 'message')
      ).toEqualTypeOf<CustomSchemaAsync<PixelString, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = CustomSchemaAsync<PixelString, undefined>;

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
