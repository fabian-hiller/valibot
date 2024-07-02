import { describe, expect, test } from 'vitest';
import {
  null_,
  number,
  object,
  picklist,
  type PicklistSchema,
  string,
} from '../../schemas/index.ts';
import { keyof } from './keyof.ts';

describe('keyof', () => {
  const objectSchema = object({ foo: string(), bar: number(), baz: null_() });
  const options = ['foo', 'bar', 'baz'] as const;
  type Options = typeof options;

  describe('should return objectSchema object', () => {
    const baseSchema: Omit<PicklistSchema<Options, never>, 'message'> = {
      kind: 'schema',
      type: 'picklist',
      reference: picklist,
      expects: '"foo" | "bar" | "baz"',
      options,
      async: false,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const picklistSchema: PicklistSchema<Options, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(keyof(objectSchema)).toStrictEqual(picklistSchema);
      expect(keyof(objectSchema, undefined)).toStrictEqual(picklistSchema);
    });

    test('with string message', () => {
      expect(keyof(objectSchema, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies PicklistSchema<Options, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(keyof(objectSchema, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies PicklistSchema<Options, typeof message>);
    });
  });
});
