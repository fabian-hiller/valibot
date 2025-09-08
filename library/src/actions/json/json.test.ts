import { describe, expect, test } from 'vitest';
import type { StringIssue } from '../../schemas/index.ts';
import { expectActionIssue, expectNoActionIssue } from '../../vitest/index.ts';
import {
  json,
  type JsonAction,
  type JsonIssue,
} from './json.ts';

describe('json', () => {
  describe('should return action object', () => {
    const baseAction: Omit<JsonAction<string, never>, 'message'> = {
      kind: 'validation',
      type: 'json',
      reference: json,
      expects: null,
      requirement: expect.any(Function),
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const action: JsonAction<string, undefined> = {
        ...baseAction,
        message: undefined,
      };
      expect(json()).toStrictEqual(action);
      expect(json(undefined)).toStrictEqual(action);
    });

    test('with string message', () => {
      expect(json('message')).toStrictEqual({
        ...baseAction,
        message: 'message',
      } satisfies JsonAction<string, string>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(json(message)).toStrictEqual({
        ...baseAction,
        message,
      } satisfies JsonAction<string, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const action = json();

    test('for untyped inputs', () => {
      const issues: [StringIssue] = [
        {
          kind: 'schema',
          type: 'string',
          input: null,
          expected: 'string',
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

    test('for literals', () => {
      expectNoActionIssue(action, [
        '{}',
        '[]',
        'null',
        '123',
        '"example"',
        '12.3',
        '"escaped \\"quote"',
      ]);
    });

    test('for complex values', () => {
      expectNoActionIssue(action, [
        '{"name":"John Doe","age":30,"color":null,"children":["Alice","Bob"]}',
        '[123, "John Doe", null, {"fruit":"apple"}]',
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const action = json('message');
    const baseIssue: Omit<JsonIssue<string>, 'input' | 'received'> = {
      kind: 'validation',
      type: 'json',
      expected: null,
      message: 'message',
      requirement: expect.any(Function),
    };

    test('for empty strings', () => {
      expectActionIssue(action, baseIssue, ['', ' ', '\n']);
    });

    test('for malformed strings', () => {
      expectActionIssue(action, baseIssue, [
        '{"key:"value"}',
        '{key":"value"}',
        "'key'",
        '"unescaped "quote""',
        '{]',
        '[}',
      ]);
    });

    test('for malformed arrays', () => {
      expectActionIssue(action, baseIssue, [
        '[1, 2, , 3]',
        '[1, 2, "key":"value"]',
      ]);
    });

    test('for malformed objects', () => {
      expectActionIssue(action, baseIssue, [
        '{"key":"value",,"key2": "value2"}',
        '{"key":"value","key2"}',
        '{{}}',
      ]);
    });

    test('for trailing commas', () => {
      expectActionIssue(action, baseIssue, [
        '{"key":"value"},',
        '{"key":"value",}',
        '[1, 2, 3,]',
      ]);
    });
  });
});
