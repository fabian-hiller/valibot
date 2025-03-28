import { describe, expect, test } from 'vitest';
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
      expect(
        minProps(2, 'item should contain at least two items')
      ).toStrictEqual({
        ...baseAction,
        message: 'item should contain at least two items',
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

    test('for valid objects', () => {
      expectNoActionIssue(action, [
        { foo: 'foo', bar: 'bar', baz: 'baz' },
        { foo: 'foo', bar: 'bar', baz: 'baz', lorem: 'ipsum' },
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = minProps(7, 'message');
    const baseIssue: Omit<MinPropsIssue<Input, 7>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'min_props',
      expected: '>=7',
      message: 'message',
      requirement: 7,
    };

    test('for invalid object', () => {
      expectActionIssue(
        action,
        baseIssue,
        [
          { foo: 'foo', bar: 'bar', baz: 'baz' },
          { foo: 'foo', bar: 'bar', baz: 'baz', lorem: 'ipsum' },
        ],
        (value) => `${Object.keys(value).length}`
      );
    });
  });
});
