import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { picklist, type PicklistSchema } from './picklist.ts';

describe('picklist', () => {
  const options = ['foo', 'bar'] as const;
  type Options = typeof options;

  describe('should return schema object', () => {
    const baseSchema: Omit<PicklistSchema<Options, never>, 'message'> = {
      kind: 'schema',
      type: 'picklist',
      expects: '"foo" | "bar"',
      options,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: PicklistSchema<Options, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(picklist(options)).toStrictEqual(schema);
      expect(picklist(options, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(picklist(options, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies PicklistSchema<Options, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(picklist(options, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies PicklistSchema<Options, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for valid options', () => {
      expectNoSchemaIssue(picklist(options), ['foo', 'bar']);
    });
  });

  describe('should return dataset with issues', () => {
    test('for invalid options', () => {
      expectSchemaIssue(
        picklist(options, 'message'),
        {
          kind: 'schema',
          type: 'picklist',
          expected: '"foo" | "bar"',
          message: 'message',
        },
        [123, 'baz', null]
      );
    });
  });
});
