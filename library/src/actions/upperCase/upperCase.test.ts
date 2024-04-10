import { describe, expect, test } from 'vitest';
import { upperCase, type UpperCaseAction } from './upperCase.ts';

describe('upperCase', () => {
  test('should return action object', () => {
    expect(upperCase()).toStrictEqual({
      kind: 'transformation',
      type: 'upper_case',
      async: false,
      _run: expect.any(Function),
    } satisfies UpperCaseAction);
  });

  describe('should transform to upper case', () => {
    const action = upperCase();

    test('for string', () => {
      expect(action._run({ typed: true, value: 'TeSt' }, {})).toStrictEqual({
        typed: true,
        value: 'TEST',
      });
    });
  });
});
