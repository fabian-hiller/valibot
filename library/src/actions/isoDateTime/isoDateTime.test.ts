import { describe, expect, test } from 'vitest';
import { ISO_DATE_TIME_REGEX } from '../../regex.ts';
import { expectActionIssue } from '../../vitest/expectActionIssue.ts';
import { expectNoActionIssue } from '../../vitest/expectNoActionIssue.ts';
import {
  isoDateTime,
  type IsoDateTimeAction,
  type IsoDateTimeIssue,
} from './isoDateTime.ts';

describe('isoDateTime', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IsoDateTimeAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'iso_datetime',
      reference: isoDateTime,
      expects: null,
      requirement: ISO_DATE_TIME_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IsoDateTimeAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(isoDateTime()).toStrictEqual(action);
      expect(isoDateTime(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(isoDateTime('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies IsoDateTimeAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(isoDateTime(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IsoDateTimeAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = isoDateTime();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid ISO date times', () => {
      expectNoActionIssue(action, [
        '0000-01-01T00:00',
        '9999-12-31T23:59',
        '2023-07-11T19:34',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = isoDateTime('message');
    const baseIssue: Omit<IsoDateTimeIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'iso_datetime',
      expected: null,
      message: 'message',
      requirement: ISO_DATE_TIME_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for missing separator', () => {
      expectActionIssue(action, baseIssue, [
        '00000101T0000',
        '000000000000',
        '000001-01T00:00',
        '0000-0101T00:00',
        '0000-01-0100:00',
        '0000-01-01T0000',
      ]);
    });
    test('for invalid separator', () => {
      expectActionIssue(action, baseIssue, [
        '0000-01-01-00-00',
        '0000-01-01:00:00',
        '0000-01:01T00-00',
        '0000:01:01:00:00',
        '0000-01-01t00:00',
      ]);
    });

    test('for missing digits', () => {
      expectActionIssue(action, baseIssue, [
        '000-01-01T00:00',
        '0000-1-01T00:00',
        '0000-01-1T00:00',
        '0000-01-01T0:00',
        '0000-01-01T00:0',
      ]);
    });

    test('for too many digits', () => {
      expectActionIssue(action, baseIssue, [
        '00000-01-01T00:00',
        '0000-001-01T00:00',
        '0000-01-001T00:00',
        '0000-01-01T000:00',
        '0000-01-01T00:000',
      ]);
    });

    test('for months lower than 1', () => {
      expectActionIssue(action, baseIssue, [
        '0000-00-01T00:00',
        '9999-00-31T23:59',
      ]);
    });

    test('for months greater than 12', () => {
      expectActionIssue(action, baseIssue, [
        '0000-13-01T00:00',
        '9999-99-31T23:59',
      ]);
    });

    test('for days lower than 1', () => {
      expectActionIssue(action, baseIssue, [
        '0000-01-00T00:00',
        '9999-12-00T23:59',
      ]);
    });

    test('for days greater than 31', () => {
      expectActionIssue(action, baseIssue, [
        '0000-01-32T00:00',
        '9999-12-99T23:59',
      ]);
    });

    test('for hours greater than 23', () => {
      expectActionIssue(action, baseIssue, [
        '0000-01-01T24:00',
        '9999-12-31T99:00',
      ]);
    });

    test('for minutes greater than 59', () => {
      expectActionIssue(action, baseIssue, [
        '0000-01-01T00:60',
        '9999-12-31T00:99',
      ]);
    });

    // FIXME: this would require more complex validation
    test.skip('for non-existent dates', () => {
      expectActionIssue(action, baseIssue, [
        '2023-06-31T00:00',
        '2024-02-30T23:59',
      ]);
    });
  });
});
