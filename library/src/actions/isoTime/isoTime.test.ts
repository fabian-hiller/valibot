import { describe, expect, test } from 'vitest';
import { ISO_TIME_REGEX } from '../../regex.ts';
import { expectActionIssue } from '../../vitest/expectActionIssue.ts';
import { expectNoActionIssue } from '../../vitest/expectNoActionIssue.ts';
import { isoTime, type IsoTimeAction, type IsoTimeIssue } from './isoTime.ts';

describe('isoTime', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IsoTimeAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'iso_time',
      reference: isoTime,
      expects: null,
      requirement: ISO_TIME_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IsoTimeAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(isoTime()).toStrictEqual(action);
      expect(isoTime(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(isoTime('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies IsoTimeAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(isoTime(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IsoTimeAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = isoTime();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid ISO times', () => {
      expectNoActionIssue(action, ['00:00', '12:34', '23:59']);
    });
  });

  describe('should return dataset with issues', () => {
    const action = isoTime('message');
    const baseIssue: Omit<IsoTimeIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'iso_time',
      expected: null,
      message: 'message',
      requirement: ISO_TIME_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for blank spaces', () => {
      expectActionIssue(action, baseIssue, [' 00:00', '00:00 ', ' 00:00 ']);
    });

    test('for missing separator', () => {
      expectActionIssue(action, baseIssue, ['0000', '1234', '2359']);
    });

    test('for invalid separators', () => {
      expectActionIssue(action, baseIssue, [
        '00 00',
        '00-00',
        '00_00',
        '00–00',
        '00/00',
        '00.00',
      ]);
    });

    test('for mathematical signs', () => {
      expectActionIssue(action, baseIssue, ['+00:00', '-12:34', '+23:59']);
    });

    test('for missing digits', () => {
      expectActionIssue(action, baseIssue, ['0:00', '00:0', '1:23', '12:3']);
    });

    test('for too many digits', () => {
      expectActionIssue(action, baseIssue, [
        '00:000',
        '000:00',
        '12:345',
        '123:45',
      ]);
    });

    test('for hours greater than 23', () => {
      expectActionIssue(action, baseIssue, ['24:00', '99:00']);
    });

    test('for minutes greater than 59', () => {
      expectActionIssue(action, baseIssue, ['00:60', '00:99']);
    });
  });
});
