import { describe, expect, test } from 'vitest';
import { toUpperCase, type ToUpperCaseAction } from './toUpperCase.ts';

describe('toUpperCase', () => {
  test('should return action object', () => {
    expect(toUpperCase()).toStrictEqual({
      kind: 'transformation',
      type: 'to_upper_case',
      reference: toUpperCase,
      async: false,
      _run: expect.any(Function),
    } satisfies ToUpperCaseAction);
  });

  describe('should upper case string', () => {
    const action = toUpperCase();

    test('for string', () => {
      expect(
        action._run({ typed: true, value: ' TeSt123 ' }, {})
      ).toStrictEqual({
        typed: true,
        value: ' TEST123 ',
      });
    });
  });
});
