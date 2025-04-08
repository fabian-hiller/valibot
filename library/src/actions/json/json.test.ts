import { describe, expect, test } from 'vitest';
import {
  json,
  type JSONAction,
  type JsonIssue,
  type JsonReviver,
} from './json.ts';

describe('json', () => {
  describe('should return action object', () => {
    const baseAction: Omit<
      JSONAction<string, never, never>,
      'message' | 'reviver'
    > = {
      kind: 'transformation',
      type: 'json',
      reference: json,
      async: false,
      '~run': expect.any(Function),
    };

    test('with reviver and message', () => {
      const reviver: JsonReviver = (k, v) => v;
      const action: JSONAction<string, typeof reviver, 'message'> = {
        ...baseAction,
        reviver,
        message: 'message',
      };
      expect(json(reviver, 'message')).toStrictEqual(action);
    });
    test('with reviver and undefined message', () => {
      const reviver: JsonReviver = (k, v) => v;
      const action: JSONAction<string, typeof reviver, undefined> = {
        ...baseAction,
        reviver,
        message: undefined,
      };
      expect(json(reviver)).toStrictEqual(action);
      expect(json(reviver, undefined)).toStrictEqual(action);
    });
    test('with undefined reviver and message', () => {
      const action: JSONAction<string, undefined, 'message'> = {
        ...baseAction,
        reviver: undefined,
        message: 'message',
      };
      expect(json(undefined, 'message')).toStrictEqual(action);
    });
    test('with undefined reviver and undefined message', () => {
      const action: JSONAction<string, undefined, undefined> = {
        ...baseAction,
        reviver: undefined,
        message: undefined,
      };
      expect(json()).toStrictEqual(action);
      expect(json(undefined, undefined)).toStrictEqual(action);
    });
  });

  describe('should return dataset without issues and parse JSON', () => {
    const input = {
      foo: 'bar',
    };
    const stringifiedInput = JSON.stringify(input);
    test('with reviver', () => {
      const action = json((k, v) =>
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
      const action = json();
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
      JsonIssue<string>,
      'input' | 'received' | 'message'
    > = {
      kind: 'transformation',
      type: 'json',
      expected: null,
    };

    test('for invalid JSON', () => {
      const action = json();
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
      const action = json(undefined, 'message');
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
      const action = json(undefined, ({ received }) => received);
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
