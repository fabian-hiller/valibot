import { describe, expect, test } from 'vitest';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  maxProps,
  type MaxPropsAction,
  type MaxPropsIssue,
} from './maxProps.ts';

describe('maxProps', () => {
  describe('should return action object', () => {
    const baseAction: Omit<MaxPropsAction<object, 2, never>, 'message'> = {
      kind: 'validation',
      type: 'max_properties',
      reference: maxProps,
      expects: '<=2',
      requirement: 2,
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: MaxPropsAction<object, 2, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(maxProps(2)).toStrictEqual(action);
      expect(maxProps(2, undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(maxProps(2, 'item should contain at least two items')).toStrictEqual({
        ...baseAction,
        message: 'item should contain at least two items',
      } satisfies MaxPropsAction<object, 2, string>);
    });

    test('with function message', () => {
      const message = (issue: MaxPropsIssue<{}, 2>) => `${issue.requirement} properties expected`;
      expect(maxProps(2, message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies MaxPropsAction<object, 2, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = maxProps(2);

    test('for valid objects', () => {
      expectNoActionIssue(action, [
        { foo: 'foo' },
        { foo: 'foo', bar: 'bar' },
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = maxProps(2, 'message');
    const baseIssue: Omit<MaxPropsIssue<{}, 2>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'max_properties',
      expected: '<=2',
      message: 'message',
      requirement: 2,
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
