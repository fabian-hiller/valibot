import { describe, expect, test } from 'vitest';
import { ISO_TIME_REGEX } from '../../regex.ts';
import { expectActionIssue } from '../../vitest/expectActionIssue.ts';
import { expectNoActionIssue } from '../../vitest/expectNoActionIssue.ts';
import type { IsoTimeAction, IsoTimeIssue } from './isoTime.ts';
import { isoTime } from './isoTime.ts';

describe('isoTime', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IsoTimeAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'iso_time',
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

    test('for valid inputs', () => {
      expectNoActionIssue(action, ['19:34', '00:00', '23:59']);
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
      expectActionIssue(action, baseIssue, ['', ' ']);
    });

    test('for less that two digits on either side', () => {
      expectActionIssue(action, baseIssue, ['1:34', '12:4', '0:00', '00:0']);
    });

    test('for more that two digits on either side', () => {
      expectActionIssue(action, baseIssue, [
        '12:345',
        '123:45',
        '00:000',
        '000:00',
      ]);
    });

    test('for minutes outside of 00-59', () => {
      expectActionIssue(action, baseIssue, ['01:60', '99:99']);
    });

    test('for hours outside of 00-23', () => {
      expectActionIssue(action, baseIssue, ['24:00', '99:99']);
    });
  });
});
