import { describe, expect, test } from 'vitest';
import { lowerCase, type LowerCaseAction } from './lowerCase.ts';

describe('lowerCase', () => {
  test('should return action object', () => {
    expect(lowerCase()).toStrictEqual({
      kind: 'transformation',
      type: 'lower_case',
      async: false,
      _run: expect.any(Function),
    } satisfies LowerCaseAction);
  });

  describe('should transform to lower case', () => {
    const action = lowerCase();

    test('for string', () => {
      expect(action._run({ typed: true, value: 'TeSt' }, {})).toStrictEqual({
        typed: true,
        value: 'test',
      });
    });
  });
});
