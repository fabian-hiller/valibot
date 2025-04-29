import { describe, expect, test } from 'vitest';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  type CountryCode,
  postalCode,
  type PostalCodeAction,
  type PostalCodeIssue,
} from './postalCode.ts';

describe('postalCode', () => {
  describe('should return action object', () => {
    const baseAction: Omit<
      PostalCodeAction<string, CountryCode, never>,
      'message'
    > = {
      kind: 'validation',
      type: 'postal_code',
      reference: postalCode,
      expects: null,
      requirement: expect.any(Function),
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: PostalCodeAction<string, CountryCode, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(postalCode('JP')).toStrictEqual(action);
      expect(postalCode('JP', undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(postalCode('JP', 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies PostalCodeAction<string, CountryCode, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(postalCode('JP', message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies PostalCodeAction<string, CountryCode, typeof message>);
    });
  });

  describe('should return dataset without issues for JP', () => {
    const action = postalCode('JP');

    test('for untyped inputs', () => {
      const issues: [StringIssue] = [
        {
          kind: 'schema',
          type: 'string',
          input: null,
          expected: 'string',
          received: 'null',
          message: 'message',
        },
      ];
      expect(
        action['~run']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues,
      });
    });

    test('valid postal codes', () => {
      expectNoActionIssue(action, ['012-3456', '0123456']);
    });
  });

  describe('should return dataset without issues for US', () => {
    const action = postalCode('US');

    test('for untyped inputs', () => {
      const issues: [StringIssue] = [
        {
          kind: 'schema',
          type: 'string',
          input: null,
          expected: 'string',
          received: 'null',
          message: 'message',
        },
      ];
      expect(
        action['~run']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues,
      });
    });

    test('for United States', () => {
      expectNoActionIssue(action, ['01234-5678', '01234']);
    });
  });

  describe('should return dataset with issues for JP', () => {
    const action = postalCode('JP', 'message');
    const baseIssue: Omit<
      PostalCodeIssue<string, string>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'postal_code',
      expected: null,
      message: 'message',
      requirement: expect.any(Function),
    };

    test('invalid postal codes', () => {
      expectActionIssue(action, baseIssue, [
        '012345', // too short
        '012-34567', // too short
        '0123-4567', // too short
        '01234567', // too long
        '012-345678', // too long
        '012345678', // too long
        '01234 5678', // with space
        '', // empty
        '\n', // lf
        ' ', // space
        '　', // space
        '\t', // tab
      ]);
    });
  });

  describe('should return dataset with issues for US', () => {
    const action = postalCode('US', 'message');
    const baseIssue: Omit<
      PostalCodeIssue<string, string>,
      'input' | 'received'
    > = {
      kind: 'validation',
      type: 'postal_code',
      expected: null,
      message: 'message',
      requirement: expect.any(Function),
    };

    test('invalid postal codes', () => {
      expectActionIssue(action, baseIssue, [
        '0123', // too short
        '0123-45678', // too short
        '012345-678', // too short
        '012345', // too long
        '01234-56789', // too long
        '0123456-789', // too long
        '01234 5678', // with space
        '', // empty
        '\n', // lf
        ' ', // space
        '　', // space
        '\t', // tab
      ]);
    });
  });
});
