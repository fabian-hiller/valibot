import { describe, expect, test } from 'vitest';
import { trim, type TrimAction } from './trim.ts';

describe('trim', () => {
  test('should return action object', () => {
    expect(trim()).toStrictEqual({
      kind: 'transformation',
      type: 'trim',
      reference: trim,
      async: false,
      '~run': expect.any(Function),
    } satisfies TrimAction);
  });

  describe('should trim string', () => {
    const action = trim();

    test('for empty string', () => {
      expect(action['~run']({ typed: true, value: '' }, {})).toStrictEqual({
        typed: true,
        value: '',
      });
      expect(action['~run']({ typed: true, value: ' ' }, {})).toStrictEqual({
        typed: true,
        value: '',
      });
    });

    test('with blanks at start', () => {
      expect(action['~run']({ typed: true, value: '  foo' }, {})).toStrictEqual(
        {
          typed: true,
          value: 'foo',
        }
      );
    });

    test('with blanks at end', () => {
      expect(action['~run']({ typed: true, value: 'foo  ' }, {})).toStrictEqual(
        {
          typed: true,
          value: 'foo',
        }
      );
    });

    test('with blanks at start and end', () => {
      expect(
        action['~run']({ typed: true, value: '  foo  ' }, {})
      ).toStrictEqual({
        typed: true,
        value: 'foo',
      });
    });
  });
});
