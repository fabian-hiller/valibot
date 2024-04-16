import { describe, expect, test } from 'vitest';
import { ISO_TIMESTAMP_REGEX } from '../../regex.ts';
import { expectActionIssue } from '../../vitest/expectActionIssue.ts';
import { expectNoActionIssue } from '../../vitest/expectNoActionIssue.ts';
import type { IsoTimestampAction, IsoTimestampIssue } from './isoTimestamp.ts';
import { isoTimestamp } from './isoTimestamp.ts';

describe('isoTimestamp', () => {
  describe('should return action object', () => {
    const baseAction: Omit<IsoTimestampAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'iso_timestamp',
      expects: null,
      requirement: ISO_TIMESTAMP_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: IsoTimestampAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(isoTimestamp()).toStrictEqual(action);
      expect(isoTimestamp(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(isoTimestamp('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies IsoTimestampAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(isoTimestamp(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies IsoTimestampAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = isoTimestamp();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for valid inputs', () => {
      expectNoActionIssue(action, [
        '2023-07-11T17:26:27.243Z',
        '0000-01-01T00:00:00.000Z',
        '9999-12-31T23:59:59.999Z',
        // milliseconds
        '2024-01-16T16:00:34Z',
        '2024-01-16T16:00:34.0Z',
        '2024-01-04T17:40:21.157953900Z',
      ]);
    });

    test('for valid inputs with offset', () => {
      expectNoActionIssue(action, [
        // '+hh:mm'
        '0000-01-01T00:00:00.000+00:00',
        // '+hhmm'
        '0000-01-01T00:00:00.000+0000',
        // '+hh'
        '0000-01-01T00:00:00.000+00',
        // '-hh:mm'
        '0000-01-01T00:00:00.000-00:00',
        // '-hhmm'
        '0000-01-01T00:00:00.000-0000',
        // '-hh'
        '0000-01-01T00:00:00.000-00',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = isoTimestamp('message');
    const baseIssue: Omit<IsoTimestampIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'iso_timestamp',
      expected: null,
      message: 'message',
      requirement: ISO_TIMESTAMP_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ']);
    });

    test('for timestamps without zulu', () => {
      expectActionIssue(action, baseIssue, [
        '2023-07-11T17:26:27.243',
        '9999-12-31T00:00:00.000',
      ]);
    });

    test('for timestamps with broken offsets', () => {
      expectActionIssue(action, baseIssue, [
        '0000-01-01T00:00:00.000+00:0', // minutes
        '0000-01-01T00:00:00.000+0:00', // hours
        '0000-01-01T00:00:00.000+00::00', // double colon
        '0000-01-01T00:00:00.000+000', // no colon
        '0000-01-01T00:00:00.000+00:', // no minutes
        '0000-01-01T00:00:00.000+', // sign but no offset
      ]);
    });

    test('for timestamps with year containing more or less than 4 digits', () => {
      expectActionIssue(action, baseIssue, [
        '999-01-01T01:00:00.000Z',
        '10000-01-01T01:00:00.000Z',
      ]);
    });

    test('for malformed timestamps', () => {
      expectActionIssue(action, baseIssue, [
        '2023-07-1117:26:27.243Z', // missing "T"
        '0000-00-00T00:00:00.000Z', // month: 00
        '0000-01-00T00:00:00.000Z', // day: 00
        '0000-13-01T01:00:00.000Z', // month: 13
        '0000-01-32T01:00:00.000Z', // day: 32
        '0000-01-01T24:00:00.000Z', // hour: 24
        '0000-01-01T01:60:00.000Z', // minute: 60
        '0000-01-01T01:00:60.000Z', // second: 60
        '0000-01-01T00:00:00.Z', // dot but no millisecond
      ]);
    });
  });
});
