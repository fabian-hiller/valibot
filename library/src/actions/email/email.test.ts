import { describe, expect, test } from 'vitest';
import { EMAIL_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { email, type EmailAction, type EmailIssue } from './email.ts';

describe('email', () => {
  describe('should return action object', () => {
    const baseAction: Omit<EmailAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'email',
      expects: null,
      requirement: EMAIL_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: EmailAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(email()).toStrictEqual(action);
      expect(email(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(email('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies EmailAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(email(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies EmailAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = email();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid emails', () => {
      expectNoActionIssue(action, [
        'email@example.com',
        '1234567890@example.com',
        '_______@example.com',
        'firstname.lastname@example.com',
        'firstname-lastname@example.com',
        'firstname+lastname@example.com',
        'email@aaa-bbb.com',
        'email@example.name',
        'email@example.co.uk',
        'email@subdomain.example.com',
        'email@subdomain.aaa-bbb.com',
        'email@subdomain.example.co.uk',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = email('message');
    const baseIssue: Omit<EmailIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'email',
      expected: null,
      message: 'message',
      requirement: EMAIL_REGEX,
    };

    test('for invalid emails', () => {
      expectActionIssue(action, baseIssue, [
        'plainaddress',
        '#@%^%#$@#$@#.com',
        '@example.com',
        'Joe Smith <email@example.com>',
        'email.example.com',
        'email@example@example.com',
        '.email@example.com',
        'email.@example.com',
        'email..email@example.com',
        'あいうえお@example.com',
        'email@example.com (Joe Smith)',
        'email@example',
        'email@-example.com',
        'email@example-.com',
        'email@111.222.333.44444',
        'email@example..com',
        'Abc..123@example.com',
      ]);
    });
  });
});
