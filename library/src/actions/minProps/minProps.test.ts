import { describe, expect, test } from 'vitest';
import { RecordIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  minProps,
  type MinPropsAction,
  type MinPropsIssue,
} from './minProps.ts';

describe('minProps', () => {
  type Input = Record<string, number>;

  describe('should return action object', () => {
    const baseAction: Omit<MinPropsAction<Input, 2, never>, 'message'> = {
      kind: 'validation',
      type: 'min_props',
      reference: minProps,
      expects: '>=2',
      requirement: 2,
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MinPropsAction<Input, 2, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(minProps(2)).toStrictEqual(action);
      expect(minProps(2, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(minProps(2, 'message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies MinPropsAction<Input, 2, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(minProps(2, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MinPropsAction<Input, 2, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = minProps(3);

    test('for untyped inputs', () => {
      const issues: [RecordIssue] = [
        {
          kind: 'schema',
          type: 'record',
          input: null,
          expected: 'Object',
          received: 'null',
          message: 'message',
        },
      ];
      expect(
        action['~run']({ typed: false, value: null, issues }, {})
      ).toStrictEqual({
        typed: false,
        value: null,
        issues,
      });
    });

    test('for valid objects', () => {
      expectNoActionIssue(action, [
        { foo: 1, bar: 2, baz: 3 },
        { foo: 1, bar: 2, baz: 3, qux: 4 },
        { foo: 1, bar: 2, baz: 3, qux: 4, quux: 5 },
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = minProps(3, 'message');
    const baseIssue: Omit<MinPropsIssue<Input, 3>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'min_props',
      expected: '>=3',
      message: 'message',
      requirement: 3,
    };

    test('for invalid objects', () => {
      expectActionIssue(
        action,
        baseIssue,
        [{}, { foo: 1 }, { foo: 1, bar: 2 }],
        (value) => `${Object.keys(value).length}`
      );
    });
  });
});
