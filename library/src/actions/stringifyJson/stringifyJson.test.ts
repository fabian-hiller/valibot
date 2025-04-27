import { describe, expect, test } from 'vitest';
import {
  type JsonReplacer,
  stringifyJson,
  type StringifyJsonAction,
  type StringifyJsonIssue,
} from './stringifyJson.ts';

describe('stringifyJson', () => {
  describe('should return action object', () => {
    const replacer: JsonReplacer = (key, value) => value;
    type Replacer = typeof replacer;
    const baseAction: Omit<
      StringifyJsonAction<unknown, never, never>,
      'message' | 'replacer'
    > = {
      kind: 'transformation',
      type: 'stringify_json',
      reference: stringifyJson,
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined replacer and undefined message', () => {
      const action: StringifyJsonAction<unknown, undefined, undefined> = {
        ...baseAction,
        replacer: undefined,
        message: undefined,
      };
      expect(stringifyJson()).toStrictEqual(action);
      expect(stringifyJson(undefined)).toStrictEqual(action);
      expect(stringifyJson(undefined, undefined)).toStrictEqual(action);
    });

    test('with undefined replacer and string message', () => {
      expect(stringifyJson(undefined, 'message')).toStrictEqual({
        ...baseAction,
        replacer: undefined,
        message: 'message',
      } satisfies StringifyJsonAction<unknown, undefined, 'message'>);
    });

    test('with undefined replacer and function message', () => {
      const message = () => 'message';
      expect(stringifyJson(undefined, message)).toStrictEqual({
        ...baseAction,
        replacer: undefined,
        message,
      } satisfies StringifyJsonAction<unknown, undefined, () => string>);
    });

    test('with replacer and undefined message', () => {
      const action: StringifyJsonAction<unknown, Replacer, undefined> = {
        ...baseAction,
        replacer,
        message: undefined,
      };
      expect(stringifyJson(replacer)).toStrictEqual(action);
      expect(stringifyJson(replacer, undefined)).toStrictEqual(action);
    });

    test('with replacer and string message', () => {
      expect(stringifyJson(replacer, 'message')).toStrictEqual({
        ...baseAction,
        replacer,
        message: 'message',
      } satisfies StringifyJsonAction<unknown, Replacer, 'message'>);
    });

    test('with replacer and function message', () => {
      const message = () => 'message';
      expect(stringifyJson(replacer, message)).toStrictEqual({
        ...baseAction,
        replacer,
        message,
      } satisfies StringifyJsonAction<unknown, Replacer, () => string>);
    });
  });

  describe('should convert JSON date into JSON string', () => {
    test('without replacer', () => {
      expect(
        stringifyJson()['~run']({ typed: true, value: { foo: 'bar' } }, {})
      ).toStrictEqual({
        typed: true,
        value: '{"foo":"bar"}',
      });
    });

    test('with replacer', () => {
      expect(
        stringifyJson((key, value) =>
          typeof value === 'string' ? value.toUpperCase() : value
        )['~run']({ typed: true, value: { foo: 'bar' } }, {})
      ).toStrictEqual({
        typed: true,
        value: '{"foo":"BAR"}',
      });
    });

    test('for nested undefined', () => {
      expect(
        stringifyJson()['~run']({ typed: true, value: { foo: undefined } }, {})
      ).toStrictEqual({
        typed: true,
        value: '{}',
      });
    });

    test('for nested function', () => {
      expect(
        stringifyJson()['~run']({ typed: true, value: { foo: () => null } }, {})
      ).toStrictEqual({
        typed: true,
        value: '{}',
      });
    });
  });

  describe('should return dataset with issues', () => {
    const action = stringifyJson(undefined, 'message');
    const baseIssue: Omit<StringifyJsonIssue<unknown>, 'input' | 'received'> = {
      kind: 'transformation',
      type: 'stringify_json',
      expected: null,
      requirement: undefined,
      message: 'message',
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('for undefined input', () => {
      const input = undefined;
      expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseIssue,
            input,
            received: 'undefined',
          },
        ],
      });
    });

    test('for bigint input', () => {
      const input = 123n;
      expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseIssue,
            input,
            received: '"Do not know how to serialize a BigInt"',
          },
        ],
      });
    });

    test('for nested bigint', () => {
      const input = { foo: 123n };
      expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseIssue,
            input,
            received: '"Do not know how to serialize a BigInt"',
          },
        ],
      });
    });

    test('for function input', () => {
      const input = () => null;
      expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
        typed: false,
        value: undefined,
        issues: [
          {
            ...baseIssue,
            input,
            received: 'Function',
          },
        ],
      });
    });

    test('for circular dependency', () => {
      const input = { foo: null as unknown };
      input.foo = input;
      expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
        typed: false,
        value: input,
        issues: [
          {
            ...baseIssue,
            input,
            received: `"Converting circular structure to JSON\n    --> starting at object with constructor 'Object'\n    --- property 'foo' closes the circle"`,
          },
        ],
      });
    });
  });
});
