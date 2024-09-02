import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { convertSchema } from './convertSchema.ts';

describe('convertSchema', () => {
  test('should convert items of pipe', () => {
    expect(
      convertSchema(
        {},
        v.pipe(v.string(), v.email(), v.description('foo')),
        undefined
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
        undefined
      )
    ).toThrowError();
    expect(() =>
      convertSchema(
        {},
        v.pipe(v.nullable(v.string()), v.string(), v.description('foo')),
        {}
      )
    ).toThrowError();
    expect(() =>
      convertSchema(
        {},
        v.pipe(v.nullable(v.string()), v.string(), v.description('foo')),
        {
          force: false,
        }
      )
    ).toThrowError();
  });

  test('should not throw error for multiple schemas in pipe when forced', () => {
    expect(
      convertSchema(
        {},
        v.pipe(v.nullable(v.string()), v.string(), v.description('foo')),
        {
          force: true,
        }
      )
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
    });
  });

  test('should convert any schema', () => {
    expect(convertSchema({}, v.any(), undefined)).toStrictEqual({});
  });

  test('should convert unknown schema', () => {
    expect(convertSchema({}, v.unknown(), undefined)).toStrictEqual({});
  });

  test('should convert null schema', () => {
    expect(convertSchema({}, v.null(), undefined)).toStrictEqual({
      type: 'null',
    });
  });

  test('should convert nullable schema', () => {
    expect(convertSchema({}, v.nullable(v.string()), undefined)).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
    });
    expect(
      convertSchema({}, v.nullable(v.string(), 'foo'), undefined)
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
      default: 'foo',
    });
    expect(
      convertSchema(
        {},
        v.nullable(v.string(), () => 'foo'),
        undefined
      )
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
      default: 'foo',
    });
    expect(() =>
      convertSchema(
        {},
        v.nullable(v.number(), () => Infinity),
        undefined
      )
    ).toThrowError(`Default value for 'nullable' is not JSON compatible.`);
  });

  test('should convert nullish schema', () => {
    expect(convertSchema({}, v.nullish(v.string()), undefined)).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
    });
    expect(
      convertSchema({}, v.nullish(v.string(), 'foo'), undefined)
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
      default: 'foo',
    });
    expect(
      convertSchema(
        {},
        v.nullish(v.string(), () => 'foo'),
        undefined
      )
    ).toStrictEqual({
      anyOf: [{ type: 'string' }, { type: 'null' }],
      default: 'foo',
    });
  });

  test('should convert boolean schema', () => {
    expect(convertSchema({}, v.boolean(), undefined)).toStrictEqual({
      type: 'boolean',
    });
  });

  test('should convert number schema', () => {
    expect(convertSchema({}, v.number(), undefined)).toStrictEqual({
      type: 'number',
    });
  });

  test('should convert string schema', () => {
    expect(convertSchema({}, v.string(), undefined)).toStrictEqual({
      type: 'string',
    });
  });

  test('should convert literal schema', () => {
    expect(() =>
      convertSchema({}, v.literal(Infinity), undefined)
    ).toThrowError();
    expect(
      convertSchema({}, v.literal(Infinity), { force: true })
    ).toStrictEqual({ const: Infinity });
    expect(convertSchema({}, v.literal(4), undefined)).toStrictEqual({
      const: 4,
    });
  });

  test('should convert picklist schema', () => {
    expect(() =>
      convertSchema({}, v.picklist([1, NaN]), undefined)
    ).toThrowError();
    expect(
      convertSchema({}, v.picklist([1, NaN]), { force: true })
    ).toStrictEqual({ enum: [1, NaN] });
    expect(
      convertSchema({}, v.picklist([1, 'string']), undefined)
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
    expect(convertSchema({}, v.enum(TestEnum), undefined)).toStrictEqual({
      enum: [0, 'key2'],
    });
  });

  test('should convert union schema', () => {
    expect(
      convertSchema({}, v.union([v.string(), v.boolean()]), undefined)
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
        undefined
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
      convertSchema({}, v.intersect([v.string(), v.boolean()]), undefined)
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
        undefined
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
        undefined
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
        undefined
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
        undefined
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
    expect(convertSchema({}, v.optional(v.string()), undefined)).toStrictEqual({
      type: 'string',
    });
    expect(
      convertSchema({}, v.optional(v.string(), 'foo'), undefined)
    ).toStrictEqual({
      type: 'string',
      default: 'foo',
    });
    expect(
      convertSchema(
        {},
        v.optional(v.string(), () => 'foo'),
        undefined
      )
    ).toStrictEqual({
      type: 'string',
      default: 'foo',
    });
    expect(() =>
      convertSchema(
        {},
        v.optional(v.number(), () => Infinity),
        undefined
      )
    ).toThrowError(`Default value for 'optional' is not JSON compatible.`);
  });

  test('should convert record schema', () => {
    expect(() =>
      convertSchema({}, v.record(v.picklist(['prop1']), v.number()), undefined)
    ).toThrowError();
    expect(
      convertSchema({}, v.record(v.picklist(['prop1']), v.number()), {
        force: true,
      })
    ).toStrictEqual({
      type: 'object',
      additionalProperties: { type: 'number' },
    });
    expect(
      convertSchema({}, v.record(v.string(), v.number()), undefined)
    ).toStrictEqual({
      type: 'object',
      additionalProperties: { type: 'number' },
    });
  });

  test('should convert tuple schema', () => {
    expect(
      convertSchema({}, v.tuple([v.number(), v.string()]), undefined)
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
        undefined
      )
    ).toStrictEqual({
      type: 'array',
      items: [{ type: 'number' }, { type: 'string' }],
      additionalItems: { type: 'boolean' },
    });
  });

  test('should convert loose tuple schema', () => {
    expect(
      convertSchema({}, v.looseTuple([v.number(), v.string()]), undefined)
    ).toStrictEqual({
      type: 'array',
      items: [{ type: 'number' }, { type: 'string' }],
      additionalItems: true,
    });
  });

  test('should convert strict tuple schema', () => {
    expect(
      convertSchema({}, v.strictTuple([v.number(), v.string()]), undefined)
    ).toStrictEqual({
      type: 'array',
      items: [{ type: 'number' }, { type: 'string' }],
      additionalItems: false,
    });
  });

  test('should convert array schema', () => {
    expect(convertSchema({}, v.array(v.number()), undefined)).toStrictEqual({
      type: 'array',
      items: { type: 'number' },
    });
  });

  test('should throw error for unsupported action', () => {
    expect(() =>
      // @ts-expect-error
      convertSchema({}, v.blob(), undefined)
    ).toThrowError();
    expect(() =>
      // @ts-expect-error
      convertSchema({}, v.blob(), {})
    ).toThrowError();
    expect(() =>
      // @ts-expect-error
      convertSchema({}, v.blob(), { force: false })
    ).toThrowError();
  });

  test('should not throw error for unsupported action when forced', () => {
    expect(
      // @ts-expect-error
      convertSchema({}, v.blob(), { force: true })
    ).toStrictEqual({});
  });
});
