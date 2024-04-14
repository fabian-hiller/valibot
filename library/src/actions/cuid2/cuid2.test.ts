import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { cuid2, type Cuid2Action, type Cuid2Issue } from './cuid2.ts';

describe('cuid2', () => {
  describe('should return action object', () => {
    const baseAction: Omit<Cuid2Action<string, never>, 'message'> = {
      kind: 'validation',
      type: 'cuid2',
      expects: null,
      requirement: expect.any(Function),
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: Cuid2Action<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(cuid2()).toStrictEqual(action);
      expect(cuid2(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(cuid2('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies Cuid2Action<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(cuid2(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies Cuid2Action<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = cuid2();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid cuid2', () => {
      const validCuid2s = [
        'o2dyrckf0vbqhftbcx8ex7r8',
        'pj17j4wheabtydu00x2yuo8s',
        'vkydd2qpoediyioixyeh8zyo',
        'ja3j1arc87i80ys1zxk8iyiv',
        'pbe6zw7wikj83vv5knjk1wx8',
      ];
      expectNoActionIssue(action, validCuid2s);
    });
  });

  describe('should return dataset with issues', () => {
    const action = cuid2('message');
    const baseIssue: Omit<Cuid2Issue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'cuid2',
      expected: null,
      message: 'message',
      requirement: expect.any(Function),
    };

    test('for invalid cuid2', () => {
      expectActionIssue(action, baseIssue, [
        '',
        'w#@%^',
        'o2dyrcKf0vbqhftBcx8ex7r8',
        '1vx6pa5rqog2tqdztxaa0xgw',
        'Not a CUID2',
      ]);
    });
  });
});
