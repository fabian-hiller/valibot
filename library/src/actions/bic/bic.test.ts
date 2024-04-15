import { describe, expect, test } from 'vitest';
import { expectActionIssue } from '../../vitest/expectActionIssue.ts';
import { expectNoActionIssue } from '../../vitest/expectNoActionIssue.ts';
import type { BicIssue } from './bic.ts';
import { bic, type BicAction } from './bic.ts';

describe('bic', () => {
  describe('should return action object', () => {
    const baseAction: Omit<BicAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'bic',
      expects: null,
      requirement: expect.any(Function),
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: BicAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(bic()).toStrictEqual(action);
      expect(bic(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(bic('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies BicAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(bic(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies BicAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = bic();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid inputs', () => {
      expectNoActionIssue(action, ['DEUTDEFF', 'DEUTDEFF400', 'NEDSZAJJXXX']);
    });
  });

  describe('should return dataset with issues', () => {
    const action = bic('message');
    const baseIssue: Omit<BicIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'bic',
      expected: null,
      message: 'message',
      requirement: expect.any(Function),
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ']);
    });

    test('for lowercase strings', () => {
      expectActionIssue(action, baseIssue, ['deutdeff', 'deutdeff400']);
    });

    test('for malformed BIC', () => {
      expectActionIssue(action, baseIssue, [
        'DEUTFF',
        'DEUT5EFF',
        'DE1TDEFF',
        'DEUTDE00',
        'DEUTDEFFXX',
        'D_UTDEFF',
        'DEUTDEDEDEED',
        'DEUTDEFFF',
      ]);
    });
  });
});
