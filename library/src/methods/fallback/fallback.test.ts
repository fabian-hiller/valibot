import { describe, expect, test } from 'vitest';
import { transform } from '../../actions/index.ts';
import { boolean, number, union } from '../../schemas/index.ts';
import { pipe } from '../pipe/index.ts';
import { fallback, type SchemaWithFallback } from './fallback.ts';

describe('fallback', () => {
  describe('should return schema object', () => {
    const schema = pipe(number(), transform(String));
    type Schema = typeof schema;
    const baseSchema: Omit<SchemaWithFallback<Schema, never>, 'fallback'> = {
      ...schema,
      '~run': expect.any(Function),
    };

    test('with value fallback', () => {
      expect(fallback(schema, '123')).toStrictEqual({
        ...baseSchema,
        fallback: '123',
        '~standard': {
          version: 1,
          vendor: 'valibot',
          validate: expect.any(Function),
        },
      } satisfies SchemaWithFallback<Schema, '123'>);
    });

    test('with function fallback', () => {
      const fallbackArg = () => '123';
      expect(fallback(schema, fallbackArg)).toStrictEqual({
        ...baseSchema,
        fallback: fallbackArg,
        '~standard': {
          version: 1,
          vendor: 'valibot',
          validate: expect.any(Function),
        },
      } satisfies SchemaWithFallback<Schema, typeof fallbackArg>);
    });
  });

  const schema = fallback(
    pipe(union([number(), boolean()]), transform(String)),
    '123'
  );

  describe('should return default dataset', () => {
    test('for valid input', () => {
      expect(schema['~run']({ value: 789 }, {})).toStrictEqual({
        typed: true,
        value: '789',
      });
    });
  });

  describe('should return dataset with fallback', () => {
    test('for invalid input', () => {
      expect(schema['~run']({ value: 'foo' }, {})).toStrictEqual({
        typed: true,
        value: '123',
      });
    });
  });
});
