import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  creditCard,
  type CreditCardAction,
  type CreditCardIssue,
} from './creditCard.ts';

describe('creditCard', () => {
  describe('should return action object', () => {
    const baseAction: Omit<CreditCardAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'credit_card',
      expects: null,
      requirement: expect.any(Function),
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: CreditCardAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(creditCard()).toStrictEqual(action);
      expect(creditCard(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(creditCard('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies CreditCardAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(creditCard(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies CreditCardAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = creditCard();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid credit cards', () => {
      const validCreditCards = [
        '4539 1488 0343 6467',
        '4539 1488 0343 6467',
        '5555 5555 5555 4444',
        '3714 4963 5398 431',
        '3530 1113 3330 0000',
        '4701 3222 1111 1234',
        '4001 9192 5753 7193',
        '4005 5500 0000 0001',
        '3020 4169 3226 43',
        '3021 8047 1965 57',
        '30218047196557',
      ];
      expectNoActionIssue(action, validCreditCards);
    });
  });

  describe('should return dataset with issues', () => {
    const action = creditCard('message');
    const baseIssue: Omit<CreditCardIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'credit_card',
      expected: null,
      message: 'message',
      requirement: expect.any(Function),
    };

    test('for invalid credit Cards', () => {
      expectActionIssue(action, baseIssue, [
        '1234',
        'Not a credit Card',
        '3530 1113 3330',
      ]);
    });
  });
});
