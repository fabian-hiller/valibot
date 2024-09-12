import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { convertSchema } from './convertSchema.ts';
import { createContext } from './vitest/index.ts';

describe('convertSchema', () => {
  describe('definitions', () => {
    test('should convert schema using definitions', () => {
      const schema = v.string();
      expect(
        convertSchema(
          {},
          schema,
          {},
          createContext({
            definitions: { foo: { type: 'string' } },
            referenceMap: new Map().set(schema, 'foo'),
          })
        )
      ).toStrictEqual({
        $ref: '#/$defs/foo',
      });
    });
  });

  describe('schema with pipe', () => {
    test('should convert pipe items', () => {
      expect(
        convertSchema(
          {},
          v.pipe(v.string(), v.email(), v.description('foo')),
          {},
          createContext()
        )
      ).toStrictEqual({
        type: 'string',
        format: 'email',
        description: 'foo',
      });
    });

    test('should convert pipe schema in definitions', () => {
      const schema = v.string();
      expect(
        convertSchema(
          {},
          v.pipe(schema, v.email(), v.description('foo')),
          {},
          createContext({
            definitions: { foo: { type: 'string' } },
            referenceMap: new Map().set(schema, 'foo'),
          })
        )
      ).toStrictEqual({
        type: 'string',
        format: 'email',
        description: 'foo',
      });
    });

    test('should throw error for multiple schemas in pipe', () => {
      expect(() =>
        convertSchema(
          {},
          v.pipe(v.nullable(v.string()), v.string(), v.description('foo')),
          {},
          createContext()
        )
      ).toThrowError(
        'A "pipe" with multiple schemas cannot be converted to JSON Schema.'
      );
    });

    test('should force convertion for multiple schemas in pipe', () => {
      expect(
        convertSchema(
          {},
          v.pipe(v.nullable(v.string()), v.string(), v.description('foo')),
          { force: true },
          createContext()
        )
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
        type: 'string',
        description: 'foo',
      });
    });
  });

  describe('primitive schemas', () => {
    test('should convert boolean schema', () => {
      expect(convertSchema({}, v.boolean(), {}, createContext())).toStrictEqual(
        {
          type: 'boolean',
        }
      );
    });

    test('should convert null schema', () => {
      expect(convertSchema({}, v.null(), {}, createContext())).toStrictEqual({
        type: 'null',
      });
    });

    test('should convert number schema', () => {
      expect(convertSchema({}, v.number(), {}, createContext())).toStrictEqual({
        type: 'number',
      });
    });

    test('should convert string schema', () => {
      expect(convertSchema({}, v.string(), {}, createContext())).toStrictEqual({
        type: 'string',
      });
    });
  });

  describe('complex schemas', () => {
    test('should convert array schema', () => {
      expect(
        convertSchema({}, v.array(v.number()), {}, createContext())
      ).toStrictEqual({
        type: 'array',
        items: { type: 'number' },
      });
    });

    test('should convert tuple schema', () => {
      expect(
        convertSchema(
          {},
          v.tuple([v.number(), v.string()]),
          {},
          createContext()
        )
      ).toStrictEqual({
        type: 'array',
        items: [{ type: 'number' }, { type: 'string' }],
        additionalItems: false,
      });
    });

    test('should convert tuple with rest schema', () => {
      expect(
        convertSchema(
          {},
          v.tupleWithRest([v.number(), v.string()], v.boolean()),
          {},
          createContext()
        )
      ).toStrictEqual({
        type: 'array',
        items: [{ type: 'number' }, { type: 'string' }],
        additionalItems: { type: 'boolean' },
      });
    });

    test('should convert loose tuple schema', () => {
      expect(
        convertSchema(
          {},
          v.looseTuple([v.number(), v.string()]),
          {},
          createContext()
        )
      ).toStrictEqual({
        type: 'array',
        items: [{ type: 'number' }, { type: 'string' }],
        additionalItems: true,
      });
    });

    test('should convert strict tuple schema', () => {
      expect(
        convertSchema(
          {},
          v.strictTuple([v.number(), v.string()]),
          {},
          createContext()
        )
      ).toStrictEqual({
        type: 'array',
        items: [{ type: 'number' }, { type: 'string' }],
        additionalItems: false,
      });
    });

    test('should convert object schema', () => {
      expect(
        convertSchema(
          {},
          // @ts-expect-error FIXME: Something is wrong here
          v.object({
            key1: v.string(),
            key2: v.optional(v.string()),
            key3: v.number(),
            key4: v.nullish(v.number()),
          }),
          {},
          createContext()
        )
      ).toStrictEqual({
        type: 'object',
        properties: {
          key1: { type: 'string' },
          key2: { type: 'string' },
          key3: { type: 'number' },
          key4: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        },
        required: ['key1', 'key3'],
        additionalProperties: false,
      });
    });

    test('should convert object with rest schema', () => {
      expect(
        convertSchema(
          {},
          // @ts-expect-error FIXME: Something is wrong here
          v.objectWithRest(
            {
              key1: v.string(),
              key2: v.optional(v.string()),
              key3: v.number(),
              key4: v.nullish(v.number()),
            },
            v.number()
          ),
          {},
          createContext()
        )
      ).toStrictEqual({
        type: 'object',
        properties: {
          key1: { type: 'string' },
          key2: { type: 'string' },
          key3: { type: 'number' },
          key4: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        },
        required: ['key1', 'key3'],
        additionalProperties: { type: 'number' },
      });
    });

    test('should convert loose object schema', () => {
      expect(
        convertSchema(
          {},
          // @ts-expect-error FIXME: Something is wrong here
          v.looseObject({
            key1: v.string(),
            key2: v.optional(v.string()),
            key3: v.number(),
            key4: v.nullish(v.number()),
          }),
          {},
          createContext()
        )
      ).toStrictEqual({
        type: 'object',
        properties: {
          key1: { type: 'string' },
          key2: { type: 'string' },
          key3: { type: 'number' },
          key4: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        },
        required: ['key1', 'key3'],
        additionalProperties: true,
      });
    });

    test('should convert strict object schema', () => {
      expect(
        convertSchema(
          {},
          // @ts-expect-error FIXME: Something is wrong here
          v.strictObject({
            key1: v.string(),
            key2: v.optional(v.string()),
            key3: v.number(),
            key4: v.nullish(v.number()),
          }),
          {},
          createContext()
        )
      ).toStrictEqual({
        type: 'object',
        properties: {
          key1: { type: 'string' },
          key2: { type: 'string' },
          key3: { type: 'number' },
          key4: { anyOf: [{ type: 'number' }, { type: 'null' }] },
        },
        required: ['key1', 'key3'],
        additionalProperties: false,
      });
    });

    test('should convert record schema', () => {
      expect(
        convertSchema({}, v.record(v.string(), v.number()), {}, createContext())
      ).toStrictEqual({
        type: 'object',
        additionalProperties: { type: 'number' },
      });
    });

    test('should throw error for record schema with pipe in key', () => {
      expect(() =>
        convertSchema(
          {},
          v.record(v.pipe(v.string(), v.email()), v.number()),
          {},
          createContext()
        )
      ).toThrowError(
        'The "record" schema with a schema for the key that contains a "pipe" cannot be converted to JSON Schema.'
      );
    });

    test('should force convertion for record schema with pipe in key schema', () => {
      expect(
        convertSchema(
          {},
          v.record(v.pipe(v.string(), v.email()), v.number()),
          { force: true },
          createContext()
        )
      ).toStrictEqual({
        type: 'object',
        additionalProperties: { type: 'number' },
      });
    });

    test('should throw error for record schema with non-string schema key', () => {
      expect(() =>
        convertSchema(
          {},
          // @ts-expect-error
          v.record(v.number(), v.number()),
          {},
          createContext()
        )
      ).toThrowError(
        'The "record" schema with the "number" schema for the key cannot be converted to JSON Schema.'
      );
    });
  });

  describe('special schemas', () => {
    test('should convert any schema', () => {
      expect(convertSchema({}, v.any(), {}, createContext())).toStrictEqual({});
    });

    test('should convert unknown schema', () => {
      expect(convertSchema({}, v.unknown(), {}, createContext())).toStrictEqual(
        {}
      );
    });

    test('should convert nullable schema without default', () => {
      expect(
        convertSchema({}, v.nullable(v.string()), {}, createContext())
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
      });
    });

    test('should convert nullable schema with default', () => {
      expect(
        convertSchema({}, v.nullable(v.string(), 'foo'), {}, createContext())
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
        default: 'foo',
      });
      expect(
        convertSchema(
          {},
          v.nullable(v.string(), () => 'foo'),
          {},
          createContext()
        )
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
        default: 'foo',
      });
    });

    test('should convert nullish schema without default', () => {
      expect(
        convertSchema({}, v.nullish(v.string()), {}, createContext())
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
      });
    });

    test('should convert nullish schema with default', () => {
      expect(
        convertSchema({}, v.nullish(v.string(), 'foo'), {}, createContext())
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
        default: 'foo',
      });
      expect(
        convertSchema(
          {},
          v.nullable(v.string(), () => 'foo'),
          {},
          createContext()
        )
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'null' }],
        default: 'foo',
      });
    });

    test('should convert optional schema without default', () => {
      expect(
        convertSchema({}, v.optional(v.string()), {}, createContext())
      ).toStrictEqual({
        type: 'string',
      });
    });

    test('should convert optional schema with default', () => {
      expect(
        convertSchema({}, v.optional(v.string(), 'foo'), {}, createContext())
      ).toStrictEqual({
        type: 'string',
        default: 'foo',
      });
      expect(
        convertSchema(
          {},
          v.optional(v.string(), () => 'foo'),
          {},
          createContext()
        )
      ).toStrictEqual({
        type: 'string',
        default: 'foo',
      });
    });

    test('should convert supported literal schema', () => {
      expect(
        convertSchema({}, v.literal(true), {}, createContext())
      ).toStrictEqual({
        const: true,
      });
      expect(
        convertSchema({}, v.literal(123), {}, createContext())
      ).toStrictEqual({
        const: 123,
      });
      expect(
        convertSchema({}, v.literal('foo'), {}, createContext())
      ).toStrictEqual({
        const: 'foo',
      });
    });

    test('should throw error for unsupported literal schema', () => {
      expect(() =>
        convertSchema({}, v.literal(123n), {}, createContext())
      ).toThrowError(
        'The value of the "literal" schema is not JSON compatible.'
      );
      expect(() =>
        convertSchema({}, v.literal(Symbol('foo')), {}, createContext())
      ).toThrowError(
        'The value of the "literal" schema is not JSON compatible.'
      );
    });

    test('should force conversion for unsupported literal schema', () => {
      expect(
        convertSchema({}, v.literal(123n), { force: true }, createContext())
      ).toStrictEqual({
        const: 123n,
      });
      const symbol = Symbol('foo');
      expect(
        convertSchema({}, v.literal(symbol), { force: true }, createContext())
      ).toStrictEqual({
        const: symbol,
      });
    });

    test('should convert enum schema', () => {
      enum TestEnum {
        KEY1,
        KEY2,
        KEY3 = 'foo',
        KEY4 = 123,
      }
      expect(
        // @ts-expect-error FIXME: Something is wrong here
        convertSchema({}, v.enum(TestEnum), {}, createContext())
      ).toStrictEqual({
        enum: [0, 1, 'foo', 123],
      });
    });

    test('should convert supported picklist schema', () => {
      expect(
        convertSchema(
          {},
          v.picklist(['foo', 123, 'bar', 456]),
          { force: false },
          createContext()
        )
      ).toStrictEqual({ enum: ['foo', 123, 'bar', 456] });
    });

    test('should throw error for unsupported picklist schema', () => {
      expect(() =>
        convertSchema({}, v.picklist([123n, 456n]), {}, createContext())
      ).toThrowError(
        'An option of the "picklist" schema is not JSON compatible.'
      );
    });

    test('should force conversion for unsupported picklist schema', () => {
      expect(
        convertSchema(
          {},
          v.picklist([123n, 456n]),
          { force: true },
          createContext()
        )
      ).toStrictEqual({ enum: [123n, 456n] });
    });

    test('should convert union schema', () => {
      expect(
        convertSchema(
          {},
          v.union([v.string(), v.boolean()]),
          {},
          createContext()
        )
      ).toStrictEqual({
        anyOf: [{ type: 'string' }, { type: 'boolean' }],
      });
    });

    test('should convert variant schema', () => {
      expect(
        convertSchema(
          {},
          v.variant('type', [
            v.object({ type: v.literal('foo'), foo: v.string() }),
            v.object({ type: v.literal('bar'), bar: v.number() }),
          ]),
          {},
          createContext()
        )
      ).toStrictEqual({
        anyOf: [
          {
            type: 'object',
            properties: {
              type: { const: 'foo' },
              foo: { type: 'string' },
            },
            required: ['type', 'foo'],
            additionalProperties: false,
          },
          {
            type: 'object',
            properties: {
              type: { const: 'bar' },
              bar: { type: 'number' },
            },
            required: ['type', 'bar'],
            additionalProperties: false,
          },
        ],
      });
    });

    test('should convert intersect schema', () => {
      expect(
        convertSchema(
          {},
          v.intersect([
            v.object({ foo: v.string() }),
            v.object({ bar: v.number() }),
          ]),
          {},
          createContext()
        )
      ).toStrictEqual({
        allOf: [
          {
            type: 'object',
            properties: {
              foo: { type: 'string' },
            },
            required: ['foo'],
            additionalProperties: false,
          },
          {
            type: 'object',
            properties: {
              bar: { type: 'number' },
            },
            required: ['bar'],
            additionalProperties: false,
          },
        ],
      });
    });

    test('should convert lazy schema', () => {
      expect(
        convertSchema(
          {},
          v.lazy(() => v.string()),
          {},
          createContext()
        )
      ).toStrictEqual({ $ref: '#/$defs/0' });
      const testSchema = v.string();
      expect(
        convertSchema(
          {},
          v.lazy(() => testSchema),
          {},
          createContext({
            definitions: { testSchema },
            referenceMap: new Map().set(testSchema, 'testSchema'),
          })
        )
      ).toStrictEqual({ $ref: '#/$defs/testSchema' });
    });
  });

  describe('other schemas', () => {
    // TODO: Add all other unsupported Valibot schemas

    test('should throw error for unsupported file schema', () => {
      expect(() =>
        // @ts-expect-error
        convertSchema({}, v.file(), {}, createContext())
      ).toThrowError('The "file" schema cannot be converted to JSON Schema.');
    });

    test('should force conversion for unsupported file schema', () => {
      expect(
        // @ts-expect-error
        convertSchema({}, v.file(), { force: true }, createContext())
      ).toStrictEqual({});
    });
  });
});
