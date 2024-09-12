import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { toJsonSchema } from './toJsonSchema.ts';

describe('toJsonSchema', () => {
  describe('should convert schema', () => {
    test('for simple string schema', () => {
      expect(toJsonSchema(v.string())).toStrictEqual({
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'string',
      });
    });

    test('for complex schema with definitions', () => {
      const stringSchema = v.string();
      const complexSchema = v.pipe(
        v.object({
          name: v.lazy(() => stringSchema),
          email: v.pipe(stringSchema, v.email(), v.minLength(10)),
          age: v.optional(v.number()),
        }),
        v.description('foo')
      );
      expect(
        toJsonSchema(complexSchema, {
          definitions: { stringSchema, complexSchema },
        })
      ).toStrictEqual({
        $schema: 'http://json-schema.org/draft-07/schema#',
        $ref: '#/$defs/complexSchema',
        $defs: {
          stringSchema: { type: 'string' },
          complexSchema: {
            type: 'object',
            properties: {
              name: { $ref: '#/$defs/stringSchema' },
              email: { type: 'string', format: 'email', minLength: 10 },
              age: { type: 'number' },
            },
            required: ['name', 'email'],
            additionalProperties: false,
            description: 'foo',
          },
        },
      });
    });
  });

  describe('should throw error', () => {
    test('for invalid file schema', () => {
      expect(() => toJsonSchema(v.file())).toThrowError(
        'The "file" schema cannot be converted to JSON Schema.'
      );
    });

    test('for invalid credit card action', () => {
      expect(() =>
        toJsonSchema(v.pipe(v.string(), v.creditCard()))
      ).toThrowError(
        'The "credit_card" action cannot be converted to JSON Schema.'
      );
    });
  });
});
