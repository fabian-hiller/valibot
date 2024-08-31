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

  test('should convert number schema', () => {
    expect(convertSchema({}, v.number(), undefined)).toStrictEqual({
      type: 'number',
    });
  });

  test('should convert object schema', () => {
    expect(
      convertSchema(
        {},
        v.object({
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
        v.objectWithRest(
          {
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
        v.looseObject({
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
        v.strictObject({
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

  test('should convert string schema', () => {
    expect(convertSchema({}, v.string(), undefined)).toStrictEqual({
      type: 'string',
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
