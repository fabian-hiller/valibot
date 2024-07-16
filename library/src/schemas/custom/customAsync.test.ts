import { describe, expect, test } from 'vitest';
import {
  expectNoSchemaIssueAsync,
  expectSchemaIssueAsync,
} from '../../vitest/index.ts';
import { customAsync, type CustomSchemaAsync } from './customAsync.ts';
import type { CustomIssue } from './types.ts';

describe('customAsync', () => {
  type PixelString = `${number}px`;
  const isPixelString = async (input: unknown) =>
    typeof input === 'string' && /^\d+px$/u.test(input);

  describe('should return schema object', () => {
    const baseSchema: Omit<CustomSchemaAsync<PixelString, never>, 'message'> = {
      kind: 'schema',
      type: 'custom',
      reference: customAsync,
      expects: 'unknown',
      check: isPixelString,
      async: true,
      _run: expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: CustomSchemaAsync<PixelString, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(customAsync(isPixelString)).toStrictEqual(schema);
      expect(customAsync(isPixelString, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(customAsync(isPixelString, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies CustomSchemaAsync<PixelString, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(customAsync(isPixelString, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies CustomSchemaAsync<PixelString, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = customAsync<PixelString>(isPixelString);

    test('for pixel strings', async () => {
      await expectNoSchemaIssueAsync(schema, ['0px', '123px', '456789px']);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = customAsync<PixelString>(isPixelString, 'message');
    const baseIssue: Omit<CustomIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'custom',
      expected: 'unknown',
      message: 'message',
    };

    // Special values

    test('for invalid pixel strings', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [
        '0',
        '0p',
        '0pxl',
        'px',
        'px0',
      ]);
    });

    // Primitive types

    test('for bigints', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [-1n, 0n, 123n]);
    });

    test('for booleans', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [true, false]);
    });

    test('for null', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [null]);
    });

    test('for numbers', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [-1, 0, 123, 45.67]);
    });

    test('for undefined', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [undefined]);
    });

    test('for strings', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, ['', 'foo', '123']);
    });

    test('for symbols', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [
        Symbol(),
        Symbol('foo'),
      ]);
    });

    // Complex types

    test('for arrays', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [[], ['value']]);
    });

    test('for functions', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [
        () => {},
        function () {},
      ]);
    });

    test('for objects', async () => {
      await expectSchemaIssueAsync(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });
});
