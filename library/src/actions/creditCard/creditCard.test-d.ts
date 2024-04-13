import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  creditCard,
  type CreditCardAction,
  type CreditCardIssue,
} from './creditCard.ts';

describe('creditCard', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = CreditCardAction<string, undefined>;
      expectTypeOf(creditCard<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        creditCard<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(creditCard<string, 'message'>('message')).toEqualTypeOf<
        CreditCardAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        creditCard<string, () => string>(() => 'message')
      ).toEqualTypeOf<CreditCardAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = CreditCardAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<
        CreditCardIssue<string>
      >();
    });
  });
});
