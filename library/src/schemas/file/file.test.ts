import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { file, type FileIssue, type FileSchema } from './file.ts';

describe('file', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<FileSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'file',
      reference: file,
      expects: 'File',
      async: false,
      '~standard': 1,
      '~vendor': 'valibot',
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: FileSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(file()).toStrictEqual(schema);
      expect(file(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(file('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies FileSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(file(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies FileSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = file();

    test('for File objects', () => {
      expectNoSchemaIssue(schema, [
        new File([], 'empty.txt'),
        new File(['foo'], 'foo.jpg'),
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = file('message');
    const baseIssue: Omit<FileIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'file',
      expected: 'File',
      message: 'message',
    };

    // Special values

    test('for blobs', () => {
      expectSchemaIssue(schema, baseIssue, [new Blob(), new Blob(['foo'])]);
    });

    // Primitive types

    test('for bigints', () => {
      expectSchemaIssue(schema, baseIssue, [-1n, 0n, 123n]);
    });

    test('for booleans', () => {
      expectSchemaIssue(schema, baseIssue, [true, false]);
    });

    test('for null', () => {
      expectSchemaIssue(schema, baseIssue, [null]);
    });

    test('for numbers', () => {
      expectSchemaIssue(schema, baseIssue, [-1, 0, 123, 45.67]);
    });

    test('for undefined', () => {
      expectSchemaIssue(schema, baseIssue, [undefined]);
    });

    test('for strings', () => {
      expectSchemaIssue(schema, baseIssue, ['', 'foo', '123']);
    });

    test('for symbols', () => {
      expectSchemaIssue(schema, baseIssue, [Symbol(), Symbol('foo')]);
    });

    // Complex types

    test('for arrays', () => {
      expectSchemaIssue(schema, baseIssue, [[], ['value']]);
    });

    test('for functions', () => {
      expectSchemaIssue(schema, baseIssue, [() => {}, function () {}]);
    });

    test('for objects', () => {
      expectSchemaIssue(schema, baseIssue, [{}, { key: 'value' }]);
    });
  });
});
