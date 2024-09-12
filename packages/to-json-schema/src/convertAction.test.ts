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

  test('should convert ISO date action', () => {
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

  test('should convert ISO timestamp action', () => {
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

  test('should convert IPv4 action', () => {
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

  test('should convert IPv6 action', () => {
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

  test('should convert length action for strings', () => {
    expect(
      convertAction(
        { type: 'string' },
        // @ts-expect-error FIXME: Something is wrong here
        v.length<string, 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'string',
      minLength: 3,
      maxLength: 3,
    });
  });

  test('should convert length action for arrays', () => {
    expect(
      convertAction(
        { type: 'array' },
        // @ts-expect-error FIXME: Something is wrong here
        v.length<unknown[], 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'array',
      minItems: 3,
      maxItems: 3,
    });
  });

  test('should throw error for length action with invalid type', () => {
    expect(() =>
      convertAction(
        {},
        // @ts-expect-error FIXME: Something is wrong here
        v.length<unknown, 3>(3),
        undefined
      )
    ).toThrowError('The "length" action is not supported on type "undefined".');
    expect(() =>
      convertAction(
        { type: 'object' },
        // @ts-expect-error FIXME: Something is wrong here
        v.length<unknown, 3>(3),
        undefined
      )
    ).toThrowError('The "length" action is not supported on type "object".');
  });

  test('should force conversion for length action with invalid type', () => {
    expect(
      convertAction(
        {},
        // @ts-expect-error FIXME: Something is wrong here
        v.length<unknown, 3>(3),
        { force: true }
      )
    ).toStrictEqual({});
    expect(
      convertAction(
        { type: 'object' },
        // @ts-expect-error FIXME: Something is wrong here
        v.length<unknown, 3>(3),
        { force: true }
      )
    ).toStrictEqual({ type: 'object' });
  });

  test('should convert min length action for strings', () => {
    expect(
      convertAction(
        { type: 'string' },
        // @ts-expect-error FIXME: Something is wrong here
        v.minLength<string, 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'string',
      minLength: 3,
    });
  });

  test('should convert min length action for arrays', () => {
    expect(
      convertAction(
        { type: 'array' },
        // @ts-expect-error FIXME: Something is wrong here
        v.minLength<unknown[], 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'array',
      minItems: 3,
    });
  });

  test('should throw error for min length action with invalid type', () => {
    expect(() =>
      convertAction(
        {},
        // @ts-expect-error FIXME: Something is wrong here
        v.minLength<unknown, 3>(3),
        undefined
      )
    ).toThrowError(
      'The "min_length" action is not supported on type "undefined".'
    );
    expect(() =>
      convertAction(
        { type: 'object' },
        // @ts-expect-error FIXME: Something is wrong here
        v.minLength<unknown, 3>(3),
        undefined
      )
    ).toThrowError(
      'The "min_length" action is not supported on type "object".'
    );
  });

  test('should force conversion for min length action with invalid type', () => {
    expect(
      convertAction(
        {},
        // @ts-expect-error FIXME: Something is wrong here
        v.minLength<unknown, 3>(3),
        { force: true }
      )
    ).toStrictEqual({});
    expect(
      convertAction(
        { type: 'object' },
        // @ts-expect-error FIXME: Something is wrong here
        v.minLength<unknown, 3>(3),
        { force: true }
      )
    ).toStrictEqual({ type: 'object' });
  });

  test('should convert max length action for strings', () => {
    expect(
      convertAction(
        { type: 'string' },
        // @ts-expect-error FIXME: Something is wrong here
        v.maxLength<string, 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'string',
      maxLength: 3,
    });
  });

  test('should convert max length action for arrays', () => {
    expect(
      convertAction(
        { type: 'array' },
        // @ts-expect-error FIXME: Something is wrong here
        v.maxLength<unknown[], 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'array',
      maxItems: 3,
    });
  });

  test('should throw error for max length action with invalid type', () => {
    expect(() =>
      convertAction(
        {},
        // @ts-expect-error FIXME: Something is wrong here
        v.maxLength<unknown, 3>(3),
        undefined
      )
    ).toThrowError(
      'The "max_length" action is not supported on type "undefined".'
    );
    expect(() =>
      convertAction(
        { type: 'object' },
        // @ts-expect-error FIXME: Something is wrong here
        v.maxLength<unknown, 3>(3),
        undefined
      )
    ).toThrowError(
      'The "max_length" action is not supported on type "object".'
    );
  });

  test('should force conversion for max length action with invalid type', () => {
    expect(
      convertAction(
        {},
        // @ts-expect-error FIXME: Something is wrong here
        v.maxLength<unknown, 3>(3),
        { force: true }
      )
    ).toStrictEqual({});
    expect(
      convertAction(
        { type: 'object' },
        // @ts-expect-error FIXME: Something is wrong here
        v.maxLength<unknown, 3>(3),
        { force: true }
      )
    ).toStrictEqual({ type: 'object' });
  });

  test('should convert max value action for numbers', () => {
    expect(
      convertAction(
        { type: 'number' },
        // @ts-expect-error FIXME: Something is wrong here
        v.maxValue<number, 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'number',
      maximum: 3,
    });
  });

  test('should throw error for max value action with invalid type', () => {
    expect(() =>
      convertAction(
        {},
        // @ts-expect-error FIXME: Something is wrong here
        v.maxValue<unknown, 3>(3),
        undefined
      )
    ).toThrowError(
      'The "max_value" action is not supported on type "undefined".'
    );
    expect(() =>
      convertAction(
        { type: 'string' },
        // @ts-expect-error FIXME: Something is wrong here
        v.maxValue<string, 3>(3),
        undefined
      )
    ).toThrowError('The "max_value" action is not supported on type "string".');
  });

  test('should force conversion for max value action with invalid type', () => {
    expect(
      convertAction(
        {},
        // @ts-expect-error FIXME: Something is wrong here
        v.maxValue<unknown, 3>(3),
        { force: true }
      )
    ).toStrictEqual({});
    expect(
      convertAction(
        { type: 'string' },
        // @ts-expect-error FIXME: Something is wrong here
        v.maxValue<string, 3>(3),
        { force: true }
      )
    ).toStrictEqual({ type: 'string' });
  });

  test('should convert min value action for numbers', () => {
    expect(
      convertAction(
        { type: 'number' },
        // @ts-expect-error FIXME: Something is wrong here
        v.minValue<number, 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'number',
      minimum: 3,
    });
  });

  test('should throw error for min value action with invalid type', () => {
    expect(() =>
      convertAction(
        {},
        // @ts-expect-error FIXME: Something is wrong here
        v.minValue<unknown, 3>(3),
        undefined
      )
    ).toThrowError(
      'The "min_value" action is not supported on type "undefined".'
    );
    expect(() =>
      convertAction(
        { type: 'string' },
        // @ts-expect-error FIXME: Something is wrong here
        v.minValue<string, 3>(3),
        undefined
      )
    ).toThrowError('The "min_value" action is not supported on type "string".');
  });

  test('should force conversion for min value action with invalid type', () => {
    expect(
      convertAction(
        {},
        // @ts-expect-error FIXME: Something is wrong here
        v.minValue<unknown, 3>(3),
        { force: true }
      )
    ).toStrictEqual({});
    expect(
      convertAction(
        { type: 'string' },
        // @ts-expect-error FIXME: Something is wrong here
        v.minValue<string, 3>(3),
        { force: true }
      )
    ).toStrictEqual({ type: 'string' });
  });

  test('should convert multiple of action', () => {
    expect(
      convertAction({}, v.multipleOf<number, 5>(5), undefined)
    ).toStrictEqual({
      multipleOf: 5,
    });
    expect(
      convertAction({ type: 'number' }, v.multipleOf<number, 5>(5), undefined)
    ).toStrictEqual({
      type: 'number',
      multipleOf: 5,
    });
  });

  test('should convert supported regex action', () => {
    expect(
      convertAction({ type: 'string' }, v.regex<string>(/[a-zA-Z]/), undefined)
    ).toStrictEqual({
      type: 'string',
      pattern: '[a-zA-Z]',
    });
  });

  test('should throw error for unsupported regex action', () => {
    expect(() =>
      convertAction({}, v.regex<string>(/[a-z]/im), undefined)
    ).toThrowError('RegExp flags are not supported by JSON Schema.');
  });

  test('should force conversion for unsupported regex action', () => {
    expect(
      convertAction({ type: 'string' }, v.regex<string>(/[a-z]/im), {
        force: true,
      })
    ).toStrictEqual({
      type: 'string',
      pattern: '[a-z]',
    });
  });

  test('should convert UUID action', () => {
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

  test('should convert value action', () => {
    expect(
      convertAction(
        { type: 'boolean' },
        // @ts-expect-error FIXME: Something is wrong here
        v.value<boolean, true>(true),
        undefined
      )
    ).toStrictEqual({
      type: 'boolean',
      const: true,
    });
    expect(
      convertAction(
        { type: 'number' },
        // @ts-expect-error FIXME: Something is wrong here
        v.value<boolean, 123>(123),
        undefined
      )
    ).toStrictEqual({
      type: 'number',
      const: 123,
    });
    expect(
      convertAction(
        { type: 'string' },
        // @ts-expect-error FIXME: Something is wrong here
        v.value<string, 'foo'>('foo'),
        undefined
      )
    ).toStrictEqual({
      type: 'string',
      const: 'foo',
    });
  });

  // TODO: Add all other unsupported Valibot actions

  test('should throw error for unsupported transform action', () => {
    expect(() =>
      convertAction(
        {},
        // @ts-expect-error
        v.transform(parseInt),
        undefined
      )
    ).toThrowError();
  });

  test('should force conversion for unsupported transform action', () => {
    expect(
      convertAction(
        {},
        // @ts-expect-error
        v.transform(parseInt),
        { force: true }
      )
    ).toStrictEqual({});
    expect(
      convertAction(
        { type: 'string' },
        // @ts-expect-error
        v.transform(parseInt),
        { force: true }
      )
    ).toStrictEqual({ type: 'string' });
  });
});
