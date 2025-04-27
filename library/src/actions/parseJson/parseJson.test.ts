import { describe, expect, test } from 'vitest';
import {
  type JsonReviver,
  parseJson,
  type ParseJsonAction,
  type ParseJsonIssue,
} from './parseJson.ts';

describe('parseJson', () => {
  describe('should return action object', () => {
    const reviver: JsonReviver = (key, value) => value;
    const baseAction: Omit<
      ParseJsonAction<string, never, never>,
      'message' | 'reviver'
    > = {
      kind: 'transformation',
      type: 'parse_json',
      reference: parseJson,
      async: false,
      '~run': expect.any(Function),
    };

    test('with undefined reviver and undefined message', () => {
      const action: ParseJsonAction<string, undefined, undefined> = {
        ...baseAction,
        reviver: undefined,
        message: undefined,
      };
      expect(parseJson()).toStrictEqual(action);
      expect(parseJson(undefined)).toStrictEqual(action);
      expect(parseJson(undefined, undefined)).toStrictEqual(action);
    });

    test('with undefined reviver and string message', () => {
      expect(parseJson(undefined, 'message')).toStrictEqual({
        ...baseAction,
        reviver: undefined,
        message: 'message',
      } satisfies ParseJsonAction<string, undefined, 'message'>);
    });

    test('with undefined reviver and function message', () => {
      const message = () => 'message';
      expect(parseJson(undefined, message)).toStrictEqual({
        ...baseAction,
        reviver: undefined,
        message,
      } satisfies ParseJsonAction<string, undefined, () => string>);
    });

    test('with reviver and undefined message', () => {
      const action: ParseJsonAction<string, typeof reviver, undefined> = {
        ...baseAction,
        reviver,
        message: undefined,
      };
      expect(parseJson(reviver)).toStrictEqual(action);
      expect(parseJson(reviver, undefined)).toStrictEqual(action);
    });

    test('with reviver and string message', () => {
      expect(parseJson(reviver, 'message')).toStrictEqual({
        ...baseAction,
        reviver,
        message: 'message',
      } satisfies ParseJsonAction<string, typeof reviver, 'message'>);
    });

    test('with reviver and function message', () => {
      const message = () => 'message';
      expect(parseJson(reviver, message)).toStrictEqual({
        ...baseAction,
        reviver,
        message,
      } satisfies ParseJsonAction<string, typeof reviver, () => string>);
    });
  });

  describe('should convert JSON string into JSON data', () => {
    const input = '{"foo":"bar"}';

    test('without reviver', () => {
      expect(
        parseJson()['~run']({ typed: true, value: input }, {})
      ).toStrictEqual({
        typed: true,
        value: { foo: 'bar' },
      });
    });

    test('with reviver', () => {
      expect(
        parseJson((key, value) =>
          typeof value === 'string' ? value.toUpperCase() : value
        )['~run']({ typed: true, value: input }, {})
      ).toStrictEqual({
        typed: true,
        value: { foo: 'BAR' },
      });
    });
  });

  describe('should return dataset with issues', () => {
    test('for invalid JSON string', () => {
      expect(
        parseJson(undefined, 'message')['~run'](
          { typed: true, value: 'foo' },
          {}
        )
      ).toStrictEqual({
        typed: false,
        value: 'foo',
        issues: [
          {
            kind: 'transformation',
            type: 'parse_json',
            input: 'foo',
            expected: null,
            received: `"Unexpected token 'o', "foo" is not valid JSON"`,
            message: 'message',
            requirement: undefined,
            path: undefined,
            issues: undefined,
            lang: undefined,
            abortEarly: undefined,
            abortPipeEarly: undefined,
          } satisfies ParseJsonIssue<string>,
        ],
      });
    });
  });
});
