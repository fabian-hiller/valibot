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

    test('for missing separator', () => {
      expectActionIssue(action, baseIssue, [
        '00000101',
        '99991231',
        '20240506',
      ]);
    });

    test('for missing digits', () => {
      expectActionIssue(action, baseIssue, [
        '000-01-01',
        '0000-1-01',
        '0000-01-1',
        '999-12-31',
        '2024-5-6',
      ]);
    });

    test('for too many digits', () => {
      expectActionIssue(action, baseIssue, [
        '00000-01-01',
        '0000-001-01',
        '0000-01-001',
        '9999-012-31',
        '9999-12-031',
      ]);
    });

    test('for months lower than 1', () => {
      expectActionIssue(action, baseIssue, ['0000-00-01', '9999-00-31']);
    });

    test('for months greater than 12', () => {
      expectActionIssue(action, baseIssue, ['0000-13-01', '9999-99-31']);
    });

    test('for days lower than 1', () => {
      expectActionIssue(action, baseIssue, ['0000-01-00', '9999-12-00']);
    });

    test('for days greater than 31', () => {
      expectActionIssue(action, baseIssue, ['0000-01-32', '9999-12-99']);
    });

    // FIXME: this would require more complex validation
    test.skip('for non-existent dates', () => {
      expectActionIssue(action, baseIssue, ['2023-06-31', '2024-02-30']);
    });
  });
});
