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
        GuardAction<string, typeof isPixelString, undefined>
      >();
    });
    test('with string message', () => {
      expectTypeOf(
        guard<string, typeof isPixelString, 'message'>(isPixelString, 'message')
      ).toEqualTypeOf<GuardAction<string, typeof isPixelString, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        guard<string, typeof isPixelString, () => string>(
          isPixelString,
          () => 'message'
        )
      ).toEqualTypeOf<
        GuardAction<string, typeof isPixelString, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<
        InferInput<GuardAction<string, typeof isPixelString, undefined>>
      >().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<
        InferOutput<GuardAction<string, typeof isPixelString, undefined>>
      >().toEqualTypeOf<PixelString>();
    });

    test('of issue', () => {
      expectTypeOf<
        InferIssue<GuardAction<string, typeof isPixelString, undefined>>
      >().toEqualTypeOf<GuardIssue<string, typeof isPixelString>>();
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
