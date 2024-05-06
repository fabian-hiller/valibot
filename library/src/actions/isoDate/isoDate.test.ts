import { describe, expect, test } from 'vitest';
import { ISO_DATE_REGEX } from '../../regex.ts';
import { expectActionIssue } from '../../vitest/expectActionIssue.ts';
import { expectNoActionIssue } from '../../vitest/expectNoActionIssue.ts';
import { isoDate, type IsoDateAction, type IsoDateIssue } from './isoDate.ts';

describe('isoDate', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IsoDateAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'iso_date',
      reference: isoDate,
      expects: null,
      requirement: ISO_DATE_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IsoDateAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(isoDate()).toStrictEqual(action);
      expect(isoDate(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(isoDate('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies IsoDateAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(isoDate(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IsoDateAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = isoDate();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid ISO dates', () => {
      expectNoActionIssue(action, ['0000-01-01', '9999-12-31', '2024-05-06']);
    });
  });

  describe('should return dataset with issues', () => {
    const action = isoDate('message');
    const baseIssue: Omit<IsoDateIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'iso_date',
      expected: null,
      message: 'message',
      requirement: ISO_DATE_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for blank spaces', () => {
      expectActionIssue(action, baseIssue, [
        ' 0000-01-01',
        '0000-01-01 ',
        ' 0000-01-01 ',
      ]);
    });

    test('for missing separator', () => {
      expectActionIssue(action, baseIssue, [
        '0000-0101',
        '000001-01',
        '00000101',
      ]);
    });

    test('for double separators', () => {
      expectActionIssue(action, baseIssue, [
        '0000--01-01',
        '0000-01--01',
        '0000--01--01',
      ]);
    });

    test('for wrong separators', () => {
      expectActionIssue(action, baseIssue, [
        '0000 01 01',
        '0000_01_01',
        '0000/01/01',
        '0000–01–01',
        '0000:01:01',
      ]);
    });

    test('for invalid year', () => {
      expectActionIssue(action, baseIssue, [
        '-01-01', // missing digits
        '0-01-01', // 1 digit
        '00-01-01', // 2 digit
        '000-01-01', // 3 digits
        '00000-01-01', // 5 digits
      ]);
    });

    test('for invalid month', () => {
      expectActionIssue(action, baseIssue, [
        '0000-01', // missing digits
        '0000-1-01', // 1 digit
        '0000-010-01', // 3 digits
        '0000-00-01', // 00
        '0000-13-01', // 13
        '0000-99-01', // 99
      ]);
    });

    test('for invalid day', () => {
      expectActionIssue(action, baseIssue, [
        '0000-01', // missing digits
        '0000-01-1', // 1 digit
        '0000-01-010', // 3 digits
        '0000-01-00', // 00
        '0000-01-32', // 32
        '0000-01-99', // 99
      ]);
    });
  });
});
