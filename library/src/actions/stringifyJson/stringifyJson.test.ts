import { describe, expect, test } from 'vitest';
import {
  type JSONReplacer,
  stringifyJson,
  type StringifyJsonAction,
  type StringifyJsonIssue,
} from './stringifyJson.ts';

describe('stringifyJson', () => {
  describe('should return action object', () => {
    const baseAction: Omit<
      StringifyJsonAction<unknown, never, never>,
      'message' | 'replacer'
    > = {
      kind: 'transformation',
      type: 'json_stringify',
      reference: stringifyJson,
      async: false,
      '~run': expect.any(Function),
    };

    test('with replacer and message', () => {
      const replacer: JSONReplacer = (k, v) => v;
      const action: StringifyJsonAction<unknown, typeof replacer, 'message'> = {
        ...baseAction,
        replacer,
        message: 'message',
      };
      expect(stringifyJson(replacer, 'message')).toStrictEqual(action);
    });
    test('with replacer and undefined message', () => {
      const replacer: JSONReplacer = (k, v) => v;
      const action: StringifyJsonAction<unknown, typeof replacer, undefined> = {
        ...baseAction,
        replacer,
        message: undefined,
      };
      expect(stringifyJson(replacer)).toStrictEqual(action);
    });
    test('with undefined replacer and message', () => {
      const action: StringifyJsonAction<unknown, undefined, 'message'> = {
        ...baseAction,
        replacer: undefined,
        message: 'message',
      };
      expect(stringifyJson(undefined, 'message')).toStrictEqual(action);
    });
    test('with undefined replacer and undefined message', () => {
      const action: StringifyJsonAction<unknown, undefined, undefined> = {
        ...baseAction,
        replacer: undefined,
        message: undefined,
      };
      expect(stringifyJson()).toStrictEqual(action);
    });
  });

  describe('should return dataset without issues and stringify values', () => {
    const input = {
      foo: 'bar',
    };
    test('with replacer', () => {
      const action = stringifyJson((k, v) =>
        typeof v === 'string' ? v.toUpperCase() : v
      );
      expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
        typed: true,
        value: '{"foo":"BAR"}',
      });
    });
    test('without replacer', () => {
      const action = stringifyJson();
      expect(action['~run']({ typed: true, value: input }, {})).toStrictEqual({
        typed: true,
        value: '{"foo":"bar"}',
      });
    });
  });

  describe('should return dataset with issues', () => {
    const baseIssue: Omit<
      StringifyJsonIssue<unknown>,
      'input' | 'received' | 'message'
    > = {
      kind: 'transformation',
      type: 'json_stringify',
      expected: null,
    };

    test('for unserializable values', () => {
      const action = stringifyJson();
      const fn = () => 0;
      expect(action['~run']({ typed: true, value: fn }, {})).toStrictEqual({
        typed: false,
        value: fn,
        issues: [
          {
            ...baseIssue,
            abortEarly: undefined,
            abortPipeEarly: undefined,
            issues: undefined,
            lang: undefined,
            path: undefined,
            requirement: undefined,
            input: fn,
            received: '"function"',
            message: `Invalid JSON: Received "function"`,
          },
        ],
      });
    });
  });
});
