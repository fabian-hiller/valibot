import { describe, expect, test } from 'vitest';
import { toLowerCase, type ToLowerCaseAction } from './toLowerCase.ts';

describe('toLowerCase', () => {
  test('should return action object', () => {
    expect(toLowerCase()).toStrictEqual({
      kind: 'transformation',
      type: 'to_lower_case',
      async: false,
      _run: expect.any(Function),
    } satisfies ToLowerCaseAction);
  });

  describe('should transform to lower case', () => {
    const action = toLowerCase();

    test('for string', () => {
      expect(action._run({ typed: true, value: 'TeSt' }, {})).toStrictEqual({
        typed: true,
        value: 'test',
      });
    });
  });
});
