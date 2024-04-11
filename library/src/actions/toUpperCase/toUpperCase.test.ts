import { describe, expect, test } from 'vitest';
import { toUpperCase, type ToUpperCaseAction } from './toUpperCase.ts';

describe('toUpperCase', () => {
  test('should return action object', () => {
    expect(toUpperCase()).toStrictEqual({
      kind: 'transformation',
      type: 'to_upper_case',
      async: false,
      _run: expect.any(Function),
    } satisfies ToUpperCaseAction);
  });

  describe('should transform to upper case', () => {
    const action = toUpperCase();

    test('for string', () => {
      expect(action._run({ typed: true, value: 'TeSt' }, {})).toStrictEqual({
        typed: true,
        value: 'TEST',
      });
    });
  });
});
