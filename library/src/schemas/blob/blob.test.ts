import { describe, expect, test } from 'vitest';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { blob, type BlobIssue, type BlobSchema } from './blob.ts';

describe('blob', () => {
  describe('should return schema object', () => {
    const baseSchema: Omit<BlobSchema<never>, 'message'> = {
      kind: 'schema',
      type: 'blob',
      reference: blob,
      expects: 'Blob',
      async: false,
      '~standard': 1,
      '~vendor': 'valibot',
      '~validate': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: BlobSchema<undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(blob()).toStrictEqual(schema);
      expect(blob(undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(blob('message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies BlobSchema<'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(blob(message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies BlobSchema<typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    const schema = blob();

    test('for Blob objects', () => {
      expectNoSchemaIssue(schema, [new Blob(), new Blob(['foo'])]);
    });

    test('for File objects', () => {
      expectNoSchemaIssue(schema, [new File(['foo'], 'foo.jpg')]);
    });
  });

  describe('should return dataset with issues', () => {
    const schema = blob('message');
    const baseIssue: Omit<BlobIssue, 'input' | 'received'> = {
      kind: 'schema',
      type: 'blob',
      expected: 'Blob',
      message: 'message',
    };

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
