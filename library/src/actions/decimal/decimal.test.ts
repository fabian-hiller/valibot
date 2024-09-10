import { describe, expect, test } from 'vitest';
import { DECIMAL_REGEX } from '../../regex.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import { decimal, type DecimalAction, type DecimalIssue } from './decimal.ts';

describe('decimal', () => {
  describe('should return action object', () => {
    const baseAction: Omit<DecimalAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'decimal',
      reference: decimal,
      expects: null,
      requirement: DECIMAL_REGEX,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const action: DecimalAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(decimal()).toStrictEqual(action);
      expect(decimal(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(decimal('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies DecimalAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(decimal(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies DecimalAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = decimal();

    test('for untyped inputs', () => {
      expect(action._run({ typed: false, value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
      });
    });

    test('for a single digit', () => {
      const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      expectNoActionIssue(action, values);
    });

    test('for two digits', () => {
      expectNoActionIssue(action, ['00', '01', '12', '99']);
    });

    test('for float numbers', () => {
      expectNoActionIssue(action, ['0.1', '123.456']);
    });

    test('for number signs', () => {
      expectNoActionIssue(action, ['+1', '-1', '+123', '-123']);
    });

    test('for float numbers with a number sign', () => {
      expectNoActionIssue(action, ['-2.0', '-52.61', '+4.0', '-11.31']);
    });

    test('for multiple digits', () => {
      expectNoActionIssue(action, ['0123456789']);
    });
  });

  describe('should return dataset with issues', () => {
    const action = decimal('message');
    const baseIssue: Omit<DecimalIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'decimal',
      expected: null,
      message: 'message',
      requirement: DECIMAL_REGEX,
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for blank spaces', () => {
      expectActionIssue(action, baseIssue, [' 1', '1 ', ' 1 ', '1 2']);
    });

    test('for number seperators', () => {
      expectActionIssue(action, baseIssue, ['1,000', '1_000', '1 000']);
    });

    test('for exponential numbers', () => {
      expectActionIssue(action, baseIssue, ['1e3', '1e-3', '1e+3']);
    });

    test('for floats ending with a dot', () => {
      expectActionIssue(action, baseIssue, ['1.', '342.']);
    });

    test('for floats starting with a dot', () => {
      expectActionIssue(action, baseIssue, ['.6', '.763']);
    });

    test('for floats starting with number sign followed by a dot', () => {
      expectActionIssue(action, baseIssue, ['-.2', '-.922', '+.5', '+.452']);
    });

    test('for floats with multiple dots', () => {
      expectActionIssue(action, baseIssue, [
        '1.2.3',
        '1..23',
        '12..3',
        '12.3.4',
        '1.23.4',
        '1.2.34',
      ]);
    });

    test('for word chars', () => {
      expectActionIssue(action, baseIssue, ['a', 'A', 'abc', 'ABC']);
    });

    test('for special chars', () => {
      expectActionIssue(action, baseIssue, [
        '-',
        '+',
        '#',
        '#1',
        '$',
        '$1',
        '%',
        '1%',
      ]);
    });
  });
});
