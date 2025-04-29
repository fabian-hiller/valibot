import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  type CountryCode,
  postalCode,
  type PostalCodeAction,
  type PostalCodeIssue,
} from './postalCode.ts';

describe('postalCode', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = PostalCodeAction<string, CountryCode, undefined>;
      expectTypeOf(
        postalCode<string, CountryCode>('JP')
      ).toEqualTypeOf<Action>();
      expectTypeOf(
        postalCode<string, CountryCode>('JP')
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(
        postalCode<string, CountryCode, 'message'>('JP', 'message')
      ).toEqualTypeOf<PostalCodeAction<string, CountryCode, 'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(
        postalCode<string, CountryCode, () => string>('JP', () => 'message')
      ).toEqualTypeOf<PostalCodeAction<string, CountryCode, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = PostalCodeAction<string, CountryCode, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        PostalCodeIssue<string, CountryCode>
      >();
    });
  });
});
