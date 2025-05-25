import { describe, expectTypeOf, test } from 'vitest';
import { pipe } from '../../methods/index.ts';
import { number, string } from '../../schemas/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { GuardAction, GuardIssue } from './guard.ts';
import { guard } from './guard.ts';

describe('guard', () => {
  type PixelString = `${number}px`;
  const isPixelString = (input: string): input is PixelString =>
    /^\d+px$/u.test(input);

  describe('should return action object', () => {
    test('with no message', () => {
      expectTypeOf(guard(isPixelString)).toEqualTypeOf<
        GuardAction<string, PixelString, undefined>
      >();
    });
    test('with string message', () => {
      expectTypeOf(
        guard<string, PixelString, 'message'>(isPixelString, 'message')
      ).toEqualTypeOf<GuardAction<string, PixelString, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        guard<string, PixelString, () => string>(isPixelString, () => 'message')
      ).toEqualTypeOf<GuardAction<string, PixelString, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<
        InferInput<GuardAction<string, PixelString, undefined>>
      >().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<
        InferOutput<GuardAction<string, PixelString, undefined>>
      >().toEqualTypeOf<PixelString>();
    });

    test('of issue', () => {
      expectTypeOf<
        InferIssue<GuardAction<string, PixelString, undefined>>
      >().toEqualTypeOf<GuardIssue<string, PixelString>>();
    });
  });

  test('should infer correct type in pipe', () => {
    pipe(
      string(),
      guard((input) => {
        expectTypeOf(input).toEqualTypeOf<string>();
        return isPixelString(input);
      })
    );
  });

  test("should error if pipe input doesn't match", () => {
    pipe(
      number(),
      // @ts-expect-error
      guard(isPixelString)
    );
  });
});
