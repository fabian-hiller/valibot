import { describe, expect, test } from 'vitest';
import { ISO_TIME_SECOND_REGEX } from '../../regex.ts';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue } from '../../vitest/expectActionIssue.ts';
import { expectNoActionIssue } from '../../vitest/expectNoActionIssue.ts';
import {
  isoTimeSecond,
  type IsoTimeSecondAction,
  type IsoTimeSecondIssue,
} from './isoTimeSecond.ts';

describe('isoTimeSecond', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IsoTimeSecondAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'iso_time_second',
      reference: isoTimeSecond,
      expects: null,
      requirement: ISO_TIME_SECOND_REGEX,
      async: false,
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IsoTimeSecondAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(isoTimeSecond()).toStrictEqual(action);
      expect(isoTimeSecond(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(isoTimeSecond('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies IsoTimeSecondAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(isoTimeSecond(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IsoTimeSecondAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = isoTimeSecond();

    test('for untyped inputs', () => {
      const issues: [StringIssue] = [
        {
          kind: 'schema',
          type: 'string',
          input: null,
          expected: 'string',
          received: 'null',
          message: 'message',
        },
      ];
      expect(
        action['~validate']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues,
      });
    });

    test('for valid ISO time seconds', () => {
      expectNoActionIssue(action, ['00:00:00', '12:34:56', '23:59:59']);
    });
  });

  describe('should return dataset with issues', () => {
    const action = isoTimeSecond('message');
    const baseIssue: Omit<IsoTimeSecondIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'iso_time_second',
      expected: null,
      message: 'message',
      requirement: ISO_TIME_SECOND_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for blank spaces', () => {
      expectActionIssue(action, baseIssue, [
        ' 00:00:00',
        '00:00:00 ',
        ' 00:00:00 ',
      ]);
    });

    test('for missing separators', () => {
      expectActionIssue(action, baseIssue, ['0000:00', '00:0000', '000000']);
    });

    test('for double separators', () => {
      expectActionIssue(action, baseIssue, [
        '00::00:00',
        '00:00::00',
        '00::00::00',
      ]);
    });

    test('for wrong separators', () => {
      expectActionIssue(action, baseIssue, [
        '00 00 00',
        '00/00/00',
        '00H00M00',
        '00_00_00',
        '00.00.00',
      ]);
    });

    test('for mathematical signs', () => {
      expectActionIssue(action, baseIssue, [
        '+00:00:00',
        '-12:34:56',
        '+23:59:59',
      ]);
    });

    test('for invalid hour', () => {
      expectActionIssue(action, baseIssue, [
        ':00:00', // missing digits
        '0:00:00', // 1 digit
        '000:00:00', // 3 digits
        '24:00:00', // 24
        '99:00:00', // 99
      ]);
    });

    test('for invalid minute', () => {
      expectActionIssue(action, baseIssue, [
        '00::00', // missing digits
        '00:0:00', // 1 digit
        '00:000:00', // 3 digits
        '00:60:00', // 60
        '00:99:00', // 99
      ]);
    });

    test('for invalid second', () => {
      expectActionIssue(action, baseIssue, [
        '00:00:', // missing digits
        '00:00:0', // 1 digit
        '00:00:000', // 3 digits
        '00:00:60', // 60
        '00:00:99', // 99
      ]);
    });
  });
});
