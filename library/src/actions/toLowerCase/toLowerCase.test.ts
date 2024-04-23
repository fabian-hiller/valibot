import { describe, expect, test } from 'vitest';
import { toLowerCase, type ToLowerCaseAction } from './toLowerCase.ts';

describe('toLowerCase', () => {
  test('should return action object', () => {
    expect(toLowerCase()).toStrictEqual({
      kind: 'transformation',
      type: 'to_lower_case',
      reference: toLowerCase,
      async: false,
      _run: expect.any(Function),
    } satisfies ToLowerCaseAction);
  });

  describe('should lower case string', () => {
    const action = toLowerCase();

    test('for string', () => {
      expect(
        action._run({ typed: true, value: ' TeSt123 ' }, {})
      ).toStrictEqual({
        typed: true,
        value: ' test123 ',
      });
    });
  });
});
