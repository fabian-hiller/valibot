import { describe, expect, test } from 'vitest';
import { trimEnd, type TrimEndAction } from './trimEnd.ts';

describe('trimEnd', () => {
  test('should return action object', () => {
    expect(trimEnd()).toStrictEqual({
      kind: 'transformation',
      type: 'trim_end',
      async: false,
      _run: expect.any(Function),
    } satisfies TrimEndAction);
  });

  describe('should trim end of string', () => {
    const action = trimEnd();

    test('for empty string', () => {
      expect(action._run({ typed: true, value: '' }, {})).toStrictEqual({
        typed: true,
        value: '',
      });
      expect(action._run({ typed: true, value: ' ' }, {})).toStrictEqual({
        typed: true,
        value: '',
      });
    });

    test('with blanks at end', () => {
      expect(action._run({ typed: true, value: 'foo  ' }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });

  test('should not trim start of string', () => {
    expect(trimEnd()._run({ typed: true, value: '  foo' }, {})).toStrictEqual({
      typed: true,
      value: '  foo',
    });
  });
});
