import { describe, expect, test } from 'vitest';
import {
  jsonParse,
  type JsonParseAction,
  type JsonParseIssue,
  type JsonReviver,
} from './jsonParse.ts';

describe('jsonParse', () => {
  describe('should return action object', () => {
    const baseAction: Omit<
      JsonParseAction<string, never, never>,
      'message' | 'reviver'
    > = {
      kind: 'transformation',
      type: 'json_parse',
      reference: jsonParse,
      async: false,
      '~run': expect.any(Function),
    };

    test('with reviver and message', () => {
      const reviver: JsonReviver = (k, v) => v;
      const action: JsonParseAction<string, typeof reviver, 'message'> = {
        ...baseAction,
        reviver,
        message: 'message',
      };
      expect(jsonParse(reviver, 'message')).toStrictEqual(action);
    });
    test('with reviver and undefined message', () => {
      const reviver: JsonReviver = (k, v) => v;
      const action: JsonParseAction<string, typeof reviver, undefined> = {
        ...baseAction,
        reviver,
        message: undefined,
      };
      expect(jsonParse(reviver)).toStrictEqual(action);
    });
    test('with undefined reviver and message', () => {
      const action: JsonParseAction<string, undefined, 'message'> = {
        ...baseAction,
        reviver: undefined,
        message: 'message',
      };
      expect(jsonParse(undefined, 'message')).toStrictEqual(action);
    });
    test('with undefined reviver and undefined message', () => {
      const action: JsonParseAction<string, undefined, undefined> = {
        ...baseAction,
        reviver: undefined,
        message: undefined,
      };
      expect(jsonParse()).toStrictEqual(action);
    });
  });

  describe('should return dataset without issues and parse JSON', () => {
    const input = {
      foo: 'bar',
    };
    const stringifiedInput = JSON.stringify(input);
    test('with reviver', () => {
      const action = jsonParse((k, v) =>
        typeof v === 'string' ? v.toUpperCase() : v
      );
      expect(
        action['~run']({ typed: true, value: stringifiedInput }, {})
      ).toStrictEqual({
        typed: true,
        value: {
          foo: 'BAR',
        },
      });
    });
    test('without reviver', () => {
      const action = jsonParse();
      expect(
        action['~run']({ typed: true, value: stringifiedInput }, {})
      ).toStrictEqual({
        typed: true,
        value: input,
      });
    });
  });
  describe('should return dataset with issues', () => {
    const baseIssue: Omit<
      JsonParseIssue<string>,
      'input' | 'received' | 'message'
    > = {
      kind: 'transformation',
      type: 'json_parse',
      expected: null,
    };

    test('for invalid JSON', () => {
      const action = jsonParse();
      expect(action['~run']({ typed: true, value: 'foo' }, {})).toStrictEqual({
        typed: false,
        value: 'foo',
        issues: [
          {
            ...baseIssue,
            abortEarly: undefined,
            abortPipeEarly: undefined,
            issues: undefined,
            lang: undefined,
            path: undefined,
            requirement: undefined,
            input: 'foo',
            received: `"Unexpected token 'o', "foo" is not valid JSON"`,
            message: `Invalid JSON: Received "Unexpected token 'o', "foo" is not valid JSON"`,
          },
        ],
      });
    });
    test('with string message', () => {
      const action = jsonParse(undefined, 'message');
      expect(action['~run']({ typed: true, value: 'foo' }, {})).toStrictEqual({
        typed: false,
        value: 'foo',
        issues: [
          {
            ...baseIssue,
            abortEarly: undefined,
            abortPipeEarly: undefined,
            issues: undefined,
            lang: undefined,
            path: undefined,
            requirement: undefined,
            input: 'foo',
            received: `"Unexpected token 'o', "foo" is not valid JSON"`,
            message: 'message',
          },
        ],
      });
    });
    test('with function message', () => {
      const action = jsonParse(undefined, ({ received }) => received);
      expect(action['~run']({ typed: true, value: 'foo' }, {})).toStrictEqual({
        typed: false,
        value: 'foo',
        issues: [
          {
            ...baseIssue,
            abortEarly: undefined,
            abortPipeEarly: undefined,
            issues: undefined,
            lang: undefined,
            path: undefined,
            requirement: undefined,
            input: 'foo',
            received: `"Unexpected token 'o', "foo" is not valid JSON"`,
            message: `"Unexpected token 'o', "foo" is not valid JSON"`,
          },
        ],
      });
    });
  });
});
