import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { type Context, createContext } from './context.ts';
import { convertSchema } from './convertSchema.ts';

describe('convertSchema', () => {
  test('should convert items of pipe', () => {
    expect(
      convertSchema(
        {},
        v.pipe(v.string(), v.email(), v.description('foo')),
        createContext()
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
        createContext()
      )
    ).toThrowError();
    expect(() =>
      convertSchema(
        {},
        v.pipe(v.nullable(v.string()), v.string(), v.description('foo')),
        createContext()
      )
    ).toThrowError();
    expect(() =>
      convertSchema(
        {},
        v.pipe(v.nullable(v.string()), v.string(), v.description('foo')),
        createContext({ force: false })
      )
    ).toThrowError();
  });

  test('should not throw error for multiple schemas in pipe when forced', () => {
    expect(
      convertSchema(
        {},
        v.pipe(v.nullable(v.string()), v.string(), v.description('foo')),
        createContext({ force: true })
      )
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
    });
  });

  test('should convert any schema', () => {
    expect(convertSchema({}, v.any(), createContext())).toStrictEqual({});
  });

  test('should convert unknown schema', () => {
    expect(convertSchema({}, v.unknown(), createContext())).toStrictEqual({});
  });

  test('should convert null schema', () => {
    expect(convertSchema({}, v.null(), createContext())).toStrictEqual({
      type: 'null',
    });
  });

  test('should convert nullable schema', () => {
    expect(
      convertSchema({}, v.nullable(v.string()), createContext())
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
    });
    expect(
      convertSchema({}, v.nullable(v.string(), 'foo'), createContext())
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
      default: 'foo',
    });
    expect(
      convertSchema(
        {},
        v.nullable(v.string(), () => 'foo'),
        createContext()
      )
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
      default: 'foo',
    });
    expect(() =>
      convertSchema(
        {},
        v.nullable(v.number(), () => Infinity),
        createContext()
      )
    ).toThrowError(`Default value for 'nullable' is not JSON compatible.`);
  });

  test('should convert nullish schema', () => {
    expect(
      convertSchema({}, v.nullish(v.string()), createContext())
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
    });
    expect(
      convertSchema({}, v.nullish(v.string(), 'foo'), createContext())
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
      default: 'foo',
    });
    expect(
      convertSchema(
        {},
        v.nullish(v.string(), () => 'foo'),
        createContext()
      )
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
      default: 'foo',
    });
  });

  test('should convert boolean schema', () => {
    expect(convertSchema({}, v.boolean(), createContext())).toStrictEqual({
      type: 'boolean',
    });
  });

  test('should convert number schema', () => {
    expect(convertSchema({}, v.number(), createContext())).toStrictEqual({
      type: 'number',
    });
  });

  test('should convert string schema', () => {
    expect(convertSchema({}, v.string(), createContext())).toStrictEqual({
      type: 'string',
    });
  });

  test('should convert literal schema', () => {
    expect(() =>
      convertSchema({}, v.literal(Infinity), createContext())
    ).toThrowError();
    expect(
      convertSchema({}, v.literal(Infinity), createContext({ force: true }))
    ).toStrictEqual({ const: Infinity });
    expect(convertSchema({}, v.literal(4), createContext())).toStrictEqual({
      const: 4,
    });
  });

  test('should convert picklist schema', () => {
    expect(() =>
      convertSchema({}, v.picklist([1, NaN]), createContext())
    ).toThrowError();
    expect(
      convertSchema({}, v.picklist([1, NaN]), createContext({ force: true }))
    ).toStrictEqual({ enum: [1, NaN] });
    expect(
      convertSchema({}, v.picklist([1, 'string']), createContext())
    ).toStrictEqual({
      enum: [1, 'string'],
    });
  });

  test('should convert enum schema', () => {
    enum TestEnum {
      KEY1,
      KEY2 = 'key2',
    }
    // @ts-expect-error
    expect(convertSchema({}, v.enum(TestEnum), createContext())).toStrictEqual({
      enum: [0, 'key2'],
    });
  });

  test('should convert union schema', () => {
    expect(
      convertSchema({}, v.union([v.string(), v.boolean()]), createContext())
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'boolean' }],
    });
  });

  test('should convert variant schema', () => {
    expect(
      convertSchema(
        {},
        v.variant('type', [
          v.object({ type: v.literal('type1') }),
          v.object({ type: v.literal('type2') }),
        ]),
        createContext()
      )
    ).toStrictEqual({
      anyOf: [
        {
          additionalProperties: false,
          properties: {
            type: { const: 'type1' },
          },
          required: ['type'],
          type: 'object',
        },
        {
          additionalProperties: false,
          properties: {
            type: { const: 'type2' },
          },
          required: ['type'],
          type: 'object',
        },
      ],
    });
  });

  test('should convert intersect schema', () => {
    expect(
      convertSchema({}, v.intersect([v.string(), v.boolean()]), createContext())
    ).toStrictEqual({
      allOf: [{ type: 'string' }, { type: 'boolean' }],
    });
  });

  test('should convert object schema', () => {
    expect(
      convertSchema(
        {},
        v.object<v.ObjectEntries>({
          [Symbol()]: v.literal('symbol keyed'),
          key1: v.string(),
          key2: v.optional(v.string()),
          key3: v.nullish(v.string()),
        }),
        createContext()
      )
    ).toStrictEqual({
      type: 'object',
      properties: {
        key1: { type: 'string' },
        key2: { type: 'string' },
        key3: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      },
      required: ['key1'],
      additionalProperties: false,
    });
  });

  test('should convert object with rest schema', () => {
    expect(
      convertSchema(
        {},
        v.objectWithRest<v.ObjectEntries, v.GenericSchema>(
          {
            [Symbol()]: v.literal('symbol keyed'),
            key1: v.string(),
            key2: v.optional(v.string()),
            key3: v.nullish(v.string()),
          },
          v.number()
        ),
        createContext()
      )
    ).toStrictEqual({
      type: 'object',
      properties: {
        key1: { type: 'string' },
        key2: { type: 'string' },
        key3: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      },
      required: ['key1'],
      additionalProperties: { type: 'number' },
    });
  });

  test('should convert loose object schema', () => {
    expect(
      convertSchema(
        {},
        v.looseObject<v.ObjectEntries>({
          [Symbol()]: v.literal('symbol keyed'),
          key1: v.string(),
          key2: v.optional(v.string()),
          key3: v.nullish(v.string()),
        }),
        createContext()
      )
    ).toStrictEqual({
      type: 'object',
      properties: {
        key1: { type: 'string' },
        key2: { type: 'string' },
        key3: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      },
      required: ['key1'],
      additionalProperties: true,
    });
  });

  test('should convert strict object schema', () => {
    expect(
      convertSchema(
        {},
        v.strictObject<v.ObjectEntries>({
          [Symbol()]: v.literal('symbol keyed'),
          key1: v.string(),
          key2: v.optional(v.string()),
          key3: v.nullish(v.string()),
        }),
        createContext()
      )
    ).toStrictEqual({
      type: 'object',
      properties: {
        key1: { type: 'string' },
        key2: { type: 'string' },
        key3: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      },
      required: ['key1'],
      additionalProperties: false,
    });
  });

  test('should convert optional schema', () => {
    expect(
      convertSchema({}, v.optional(v.string()), createContext())
    ).toStrictEqual({
      type: 'string',
    });
    expect(
      convertSchema({}, v.optional(v.string(), 'foo'), createContext())
    ).toStrictEqual({
      type: 'string',
      default: 'foo',
    });
    expect(
      convertSchema(
        {},
        v.optional(v.string(), () => 'foo'),
        createContext()
      )
    ).toStrictEqual({
      type: 'string',
      default: 'foo',
    });
    expect(() =>
      convertSchema(
        {},
        v.optional(v.number(), () => Infinity),
        createContext()
      )
    ).toThrowError(`Default value for 'optional' is not JSON compatible.`);
  });

  test('should convert record schema', () => {
    expect(() =>
      convertSchema(
        {},
        v.record(v.picklist(['prop1']), v.number()),
        createContext()
      )
    ).toThrowError();
    expect(
      convertSchema(
        {},
        v.record(v.picklist(['prop1']), v.number()),
        createContext({ force: true })
      )
    ).toStrictEqual({
      type: 'object',
      additionalProperties: { type: 'number' },
    });
    expect(
      convertSchema({}, v.record(v.string(), v.number()), createContext())
    ).toStrictEqual({
      type: 'object',
      additionalProperties: { type: 'number' },
    });
  });

  test('should convert tuple schema', () => {
    expect(
      convertSchema({}, v.tuple([v.number(), v.string()]), createContext())
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
      convertSchema({}, v.looseTuple([v.number(), v.string()]), createContext())
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
        createContext()
      )
    ).toStrictEqual({
      type: 'array',
      items: [{ type: 'number' }, { type: 'string' }],
      additionalItems: false,
    });
  });

  test('should convert array schema', () => {
    expect(
      convertSchema({}, v.array(v.number()), createContext())
    ).toStrictEqual({
      type: 'array',
      items: { type: 'number' },
    });
  });

  test('should convert lazy schema', () => {
    expect(() =>
      convertSchema(
        {},
        v.lazy(() => v.number()),
        createContext()
      )
    ).toThrowError();

    const aNumber = v.number();
    const definitionsPathMap: Context['definitionsPathMap'] = new Map();
    definitionsPathMap.set(aNumber, '#/$defs/aNumber');
    const context = { ...createContext(), definitionsPathMap };
    expect(
      convertSchema(
        {},
        v.lazy(() => aNumber),
        context
      )
    ).toStrictEqual({ $ref: '#/$defs/aNumber' });
  });

  test('should throw error for unsupported action', () => {
    expect(() =>
      // @ts-expect-error
      convertSchema({}, v.blob(), createContext())
    ).toThrowError();
    expect(() =>
      // @ts-expect-error
      convertSchema({}, v.blob(), {})
    ).toThrowError();
    expect(() =>
      // @ts-expect-error
      convertSchema({}, v.blob(), createContext({ force: false }))
    ).toThrowError();
  });

  test('should not throw error for unsupported action when forced', () => {
    expect(
      // @ts-expect-error
      convertSchema({}, v.blob(), createContext({ force: true }))
    ).toStrictEqual({});
  });
});
