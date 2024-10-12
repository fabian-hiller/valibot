import { describe, expect, test } from 'vitest';
import { trimStart, type TrimStartAction } from './trimStart.ts';

describe('trimStart', () => {
  test('should return action object', () => {
    expect(trimStart()).toStrictEqual({
      kind: 'transformation',
      type: 'trim_start',
      reference: trimStart,
      async: false,
      '~validate': expect.any(Function),
    } satisfies TrimStartAction);
  });

  describe('should trim start of string', () => {
    const action = trimStart();

    test('for empty string', () => {
      expect(action['~validate']({ typed: true, value: '' }, {})).toStrictEqual(
        {
          typed: true,
          value: '',
        }
      );
      expect(
        action['~validate']({ typed: true, value: ' ' }, {})
      ).toStrictEqual({
        typed: true,
        value: '',
      });
    });

    test('with blanks at start', () => {
      expect(
        action['~validate']({ typed: true, value: '  foo' }, {})
      ).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });

  test('should not trim end of string', () => {
    expect(
      trimStart()['~validate']({ typed: true, value: 'foo  ' }, {})
    ).toStrictEqual({ typed: true, value: 'foo  ' });
  });
});
