import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { convertAction } from './convertAction.ts';

describe('convertAction', () => {
  test('should convert description action', () => {
    expect(convertAction({}, v.description('test'), undefined)).toStrictEqual({
      description: 'test',
    });
  });

  test('should convert email action', () => {
    expect(convertAction({}, v.email<string>(), undefined)).toStrictEqual({
      format: 'email',
    });
    expect(
      convertAction({ type: 'string' }, v.email<string>(), undefined)
    ).toStrictEqual({
      type: 'string',
      format: 'email',
    });
  });

  test('should convert isoDate action', () => {
    expect(convertAction({}, v.isoDate<string>(), undefined)).toStrictEqual({
      format: 'date',
    });
    expect(
      convertAction({ type: 'string' }, v.isoDate<string>(), undefined)
    ).toStrictEqual({
      type: 'string',
      format: 'date',
    });
  });

  test('should convert isoTimestamp action', () => {
    expect(
      convertAction({}, v.isoTimestamp<string>(), undefined)
    ).toStrictEqual({
      format: 'date-time',
    });
    expect(
      convertAction({ type: 'string' }, v.isoTimestamp<string>(), undefined)
    ).toStrictEqual({
      type: 'string',
      format: 'date-time',
    });
  });

  test('should convert ipv4 action', () => {
    expect(convertAction({}, v.ipv4<string>(), undefined)).toStrictEqual({
      format: 'ipv4',
    });
    expect(
      convertAction({ type: 'string' }, v.ipv4<string>(), undefined)
    ).toStrictEqual({
      type: 'string',
      format: 'ipv4',
    });
  });

  test('should convert ipv6 action', () => {
    expect(convertAction({}, v.ipv6<string>(), undefined)).toStrictEqual({
      format: 'ipv6',
    });
    expect(
      convertAction({ type: 'string' }, v.ipv6<string>(), undefined)
    ).toStrictEqual({
      type: 'string',
      format: 'ipv6',
    });
  });

  test('should convert uuid action', () => {
    expect(convertAction({}, v.uuid<string>(), undefined)).toStrictEqual({
      format: 'uuid',
    });
    expect(
      convertAction({ type: 'string' }, v.uuid<string>(), undefined)
    ).toStrictEqual({
      type: 'string',
      format: 'uuid',
    });
  });

  test('should convert regex action', () => {
    expect(() =>
      convertAction({}, v.regex<string>(/[a-z]/im), undefined)
    ).toThrowError();
    expect(
      convertAction({ type: 'string' }, v.regex<string>(/[a-z]/im), {
        force: true,
      })
    ).toStrictEqual({
      type: 'string',
      pattern: '[a-z]',
    });
    expect(
      convertAction({ type: 'string' }, v.regex<string>(/[a-zA-Z]/), undefined)
    ).toStrictEqual({
      type: 'string',
      pattern: '[a-zA-Z]',
    });
  });

  test('should convert integer action', () => {
    expect(convertAction({}, v.integer<number>(), undefined)).toStrictEqual({
      type: 'integer',
    });
    expect(
      convertAction({ type: 'number' }, v.integer<number>(), undefined)
    ).toStrictEqual({
      type: 'integer',
    });
  });

  test('should convert length action', () => {
    expect(() =>
      // @ts-expect-error
      convertAction({}, v.length(2), undefined)
    ).toThrowError();
    expect(
      // @ts-expect-error
      convertAction({}, v.length(2), { force: true })
    ).toStrictEqual({});
    expect(
      // @ts-expect-error
      convertAction({ type: 'string' }, v.length(2), undefined)
    ).toStrictEqual({
      type: 'string',
      minLength: 2,
      maxLength: 2,
    });
    expect(
      // @ts-expect-error
      convertAction({ type: 'array' }, v.length(2), undefined)
    ).toStrictEqual({
      type: 'array',
      minItems: 2,
      maxItems: 2,
    });
  });

  test('should convert minLength action', () => {
    expect(() =>
      // @ts-expect-error
      convertAction({}, v.minLength(2), undefined)
    ).toThrowError();
    expect(
      // @ts-expect-error
      convertAction({}, v.minLength(2), { force: true })
    ).toStrictEqual({});
    expect(
      // @ts-expect-error
      convertAction({ type: 'string' }, v.minLength(2), undefined)
    ).toStrictEqual({
      type: 'string',
      minLength: 2,
    });
    expect(
      // @ts-expect-error
      convertAction({ type: 'array' }, v.minLength(2), undefined)
    ).toStrictEqual({
      type: 'array',
      minItems: 2,
    });
  });

  test('should convert maxLength action', () => {
    expect(() =>
      // @ts-expect-error
      convertAction({}, v.maxLength(2), undefined)
    ).toThrowError();
    expect(
      // @ts-expect-error
      convertAction({}, v.maxLength(2), { force: true })
    ).toStrictEqual({});
    expect(
      // @ts-expect-error
      convertAction({ type: 'string' }, v.maxLength(2), undefined)
    ).toStrictEqual({
      type: 'string',
      maxLength: 2,
    });
    expect(
      // @ts-expect-error
      convertAction({ type: 'array' }, v.maxLength(2), undefined)
    ).toStrictEqual({
      type: 'array',
      maxItems: 2,
    });
  });

  test('should convert value action', () => {
    expect(() =>
      // @ts-expect-error
      convertAction({}, v.value(2), undefined)
    ).toThrowError();
    expect(
      // @ts-expect-error
      convertAction({}, v.value(2), { force: true })
    ).toStrictEqual({});
    expect(() =>
      // @ts-expect-error
      convertAction({ type: 'number' }, v.value(Infinity), undefined)
    ).toThrowError();
    expect(
      // @ts-expect-error
      convertAction({ type: 'number' }, v.value(Infinity), { force: true })
    ).toStrictEqual({
      type: 'number',
      const: Infinity,
    });
    expect(
      // @ts-expect-error
      convertAction({ type: 'number' }, v.value(2), undefined)
    ).toStrictEqual({
      type: 'number',
      const: 2,
    });
    expect(
      // @ts-expect-error
      convertAction({ type: 'string' }, v.value('value'), undefined)
    ).toStrictEqual({
      type: 'string',
      const: 'value',
    });
    expect(
      // @ts-expect-error
      convertAction({ type: 'boolean' }, v.value(true), undefined)
    ).toStrictEqual({
      type: 'boolean',
      const: true,
    });
  });

  test('should convert minValue action', () => {
    expect(() =>
      // @ts-expect-error
      convertAction({}, v.minValue(2), undefined)
    ).toThrowError();
    expect(
      // @ts-expect-error
      convertAction({}, v.minValue(2), { force: true })
    ).toStrictEqual({});
    expect(() =>
      // @ts-expect-error
      convertAction({ type: 'number' }, v.minValue(Infinity), undefined)
    ).toThrowError();
    expect(
      // @ts-expect-error
      convertAction({ type: 'number' }, v.minValue(Infinity), { force: true })
    ).toStrictEqual({
      type: 'number',
      minimum: Infinity,
    });
    expect(
      // @ts-expect-error
      convertAction({ type: 'number' }, v.minValue(2), undefined)
    ).toStrictEqual({
      type: 'number',
      minimum: 2,
    });
  });

  test('should convert maxValue action', () => {
    expect(() =>
      // @ts-expect-error
      convertAction({}, v.maxValue(2), undefined)
    ).toThrowError();
    expect(
      // @ts-expect-error
      convertAction({}, v.maxValue(2), { force: true })
    ).toStrictEqual({});
    expect(() =>
      // @ts-expect-error
      convertAction({ type: 'number' }, v.maxValue(Infinity), undefined)
    ).toThrowError();
    expect(
      // @ts-expect-error
      convertAction({ type: 'number' }, v.maxValue(Infinity), { force: true })
    ).toStrictEqual({
      type: 'number',
      maximum: Infinity,
    });
    expect(() =>
      // @ts-expect-error
      convertAction({ type: 'number' }, v.maxValue(Infinity), undefined)
    ).toThrowError();
    expect(
      // @ts-expect-error
      convertAction({ type: 'number' }, v.maxValue(2), undefined)
    ).toStrictEqual({
      type: 'number',
      maximum: 2,
    });
  });

  test('should convert multipleOf action', () => {
    expect(() =>
      convertAction(
        { type: 'number' },
        v.multipleOf<number, number>(Infinity),
        undefined
      )
    ).toThrowError();
    expect(
      convertAction(
        { type: 'number' },
        v.multipleOf<number, number>(Infinity),
        { force: true }
      )
    ).toStrictEqual({
      type: 'number',
      multipleOf: Infinity,
    });
    expect(
      convertAction(
        { type: 'number' },
        v.multipleOf<number, number>(2),
        undefined
      )
    ).toStrictEqual({
      type: 'number',
      multipleOf: 2,
    });
  });

  test('should throw error for unsupported action', () => {
    expect(() =>
      // @ts-expect-error
      convertAction({}, v.transform(parseInt), undefined)
    ).toThrowError();
    expect(() =>
      // @ts-expect-error
      convertAction({}, v.transform(parseInt), {})
    ).toThrowError();
    expect(() =>
      // @ts-expect-error
      convertAction({}, v.transform(parseInt), { force: false })
    ).toThrowError();
  });

  test('should not throw error for unsupported action when forced', () => {
    expect(
      // @ts-expect-error
      convertAction({}, v.transform(parseInt), { force: true })
    ).toStrictEqual({});
    expect(
      // @ts-expect-error
      convertAction({ type: 'string' }, v.transform(parseInt), { force: true })
    ).toStrictEqual({ type: 'string' });
  });
});
