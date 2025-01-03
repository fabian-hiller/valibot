import * as v from 'valibot';
import { describe, expect, test, vi } from 'vitest';
import { convertAction } from './convertAction.ts';

console.warn = vi.fn();

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
        v.length<v.LengthInput, 3>(3),
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
      convertAction({ type: 'array' }, v.length<v.LengthInput, 3>(3), undefined)
    ).toStrictEqual({
      type: 'array',
      minItems: 3,
      maxItems: 3,
    });
  });

  test('should throw error for length action with invalid type', () => {
    const action = v.length<v.LengthInput, 3>(3);
    const error1 = 'The "length" action is not supported on type "undefined".';
    expect(() => convertAction({}, action, undefined)).toThrowError(error1);
    expect(() =>
      convertAction({}, action, { errorMode: 'throw' })
    ).toThrowError(error1);
    const error2 = 'The "length" action is not supported on type "object".';
    expect(() =>
      convertAction({ type: 'object' }, action, undefined)
    ).toThrowError(error2);
    expect(() =>
      convertAction({ type: 'object' }, action, { errorMode: 'throw' })
    ).toThrowError(error2);
  });

  test('should warn error for length action with invalid type', () => {
    expect(
      convertAction({}, v.length<v.LengthInput, 3>(3), { errorMode: 'warn' })
    ).toStrictEqual({
      minLength: 3,
      maxLength: 3,
    });
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "length" action is not supported on type "undefined".'
    );
    expect(
      convertAction({ type: 'object' }, v.length<v.LengthInput, 3>(3), {
        errorMode: 'warn',
      })
    ).toStrictEqual({ type: 'object', minLength: 3, maxLength: 3 });
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "length" action is not supported on type "object".'
    );
  });

  test('should convert min length action for strings', () => {
    expect(
      convertAction(
        { type: 'string' },
        v.minLength<v.LengthInput, 3>(3),
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
        v.minLength<v.LengthInput, 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'array',
      minItems: 3,
    });
  });

  test('should throw error for min length action with invalid type', () => {
    const action = v.minLength<v.LengthInput, 3>(3);
    const error1 =
      'The "min_length" action is not supported on type "undefined".';
    expect(() => convertAction({}, action, undefined)).toThrowError(error1);
    expect(() =>
      convertAction({}, action, { errorMode: 'throw' })
    ).toThrowError(error1);
    const error2 = 'The "min_length" action is not supported on type "object".';
    expect(() =>
      convertAction({ type: 'object' }, action, undefined)
    ).toThrowError(error2);
    expect(() =>
      convertAction({ type: 'object' }, action, { errorMode: 'throw' })
    ).toThrowError(error2);
  });

  test('should warn error for min length action with invalid type', () => {
    expect(
      convertAction({}, v.minLength<v.LengthInput, 3>(3), { errorMode: 'warn' })
    ).toStrictEqual({
      minLength: 3,
    });
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "min_length" action is not supported on type "undefined".'
    );
    expect(
      convertAction({ type: 'object' }, v.minLength<v.LengthInput, 3>(3), {
        errorMode: 'warn',
      })
    ).toStrictEqual({ type: 'object', minLength: 3 });
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "min_length" action is not supported on type "object".'
    );
  });

  test('should convert max length action for strings', () => {
    expect(
      convertAction(
        { type: 'string' },
        v.maxLength<v.LengthInput, 3>(3),
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
        v.maxLength<v.LengthInput, 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'array',
      maxItems: 3,
    });
  });

  test('should throw error for max length action with invalid type', () => {
    const action = v.maxLength<v.LengthInput, 3>(3);
    const error1 =
      'The "max_length" action is not supported on type "undefined".';
    expect(() => convertAction({}, action, undefined)).toThrowError(error1);
    expect(() =>
      convertAction({}, action, { errorMode: 'throw' })
    ).toThrowError(error1);
    const error2 = 'The "max_length" action is not supported on type "object".';
    expect(() =>
      convertAction({ type: 'object' }, action, undefined)
    ).toThrowError(error2);
    expect(() =>
      convertAction({ type: 'object' }, action, { errorMode: 'throw' })
    ).toThrowError(error2);
  });

  test('should warn error for max length action with invalid type', () => {
    expect(
      convertAction({}, v.maxLength<v.LengthInput, 3>(3), { errorMode: 'warn' })
    ).toStrictEqual({
      maxLength: 3,
    });
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "max_length" action is not supported on type "undefined".'
    );
    expect(
      convertAction({ type: 'object' }, v.maxLength<v.LengthInput, 3>(3), {
        errorMode: 'warn',
      })
    ).toStrictEqual({ type: 'object', maxLength: 3 });
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "max_length" action is not supported on type "object".'
    );
  });

  test('should convert max value action for numbers', () => {
    expect(
      convertAction(
        { type: 'number' },
        v.maxValue<v.ValueInput, 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'number',
      maximum: 3,
    });
  });

  test('should throw error for max value action with invalid type', () => {
    const action = v.maxValue<v.ValueInput, 3>(3);
    const error1 =
      'The "max_value" action is not supported on type "undefined".';
    expect(() => convertAction({}, action, undefined)).toThrowError(error1);
    expect(() =>
      convertAction({}, action, { errorMode: 'throw' })
    ).toThrowError(error1);
    const error2 = 'The "max_value" action is not supported on type "string".';
    expect(() =>
      convertAction({ type: 'string' }, action, undefined)
    ).toThrowError(error2);
    expect(() =>
      convertAction({ type: 'string' }, action, { errorMode: 'throw' })
    ).toThrowError(error2);
  });

  test('should warn error for max value action with invalid type', () => {
    expect(
      convertAction({}, v.maxValue<v.ValueInput, 3>(3), { errorMode: 'warn' })
    ).toStrictEqual({
      maximum: 3,
    });
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "max_value" action is not supported on type "undefined".'
    );
    expect(
      convertAction({ type: 'string' }, v.maxValue<v.ValueInput, 3>(3), {
        errorMode: 'warn',
      })
    ).toStrictEqual({ type: 'string', maximum: 3 });
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "max_value" action is not supported on type "string".'
    );
  });

  test('should convert min value action for numbers', () => {
    expect(
      convertAction(
        { type: 'number' },
        v.minValue<v.ValueInput, 3>(3),
        undefined
      )
    ).toStrictEqual({
      type: 'number',
      minimum: 3,
    });
  });

  test('should throw error for min value action with invalid type', () => {
    const action = v.minValue<v.ValueInput, 3>(3);
    const error1 =
      'The "min_value" action is not supported on type "undefined".';
    expect(() => convertAction({}, action, undefined)).toThrowError(error1);
    expect(() =>
      convertAction({}, action, { errorMode: 'throw' })
    ).toThrowError(error1);
    const error2 = 'The "min_value" action is not supported on type "string".';
    expect(() =>
      convertAction({ type: 'string' }, action, undefined)
    ).toThrowError(error2);
    expect(() =>
      convertAction({ type: 'string' }, action, { errorMode: 'throw' })
    ).toThrowError(error2);
  });

  test('should warn error for min value action with invalid type', () => {
    expect(
      convertAction({}, v.minValue<v.ValueInput, 3>(3), { errorMode: 'warn' })
    ).toStrictEqual({
      minimum: 3,
    });
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "min_value" action is not supported on type "undefined".'
    );
    expect(
      convertAction({ type: 'string' }, v.minValue<v.ValueInput, 3>(3), {
        errorMode: 'warn',
      })
    ).toStrictEqual({ type: 'string', minimum: 3 });
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "min_value" action is not supported on type "string".'
    );
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
    const action = v.regex<string>(/[a-z]/im);
    const error = 'RegExp flags are not supported by JSON Schema.';
    expect(() => convertAction({}, action, undefined)).toThrowError(error);
    expect(() =>
      convertAction({}, action, { errorMode: 'throw' })
    ).toThrowError(error);
  });

  test('should warn error for unsupported regex action', () => {
    expect(
      convertAction({ type: 'string' }, v.regex<string>(/[a-z]/im), {
        errorMode: 'warn',
      })
    ).toStrictEqual({
      type: 'string',
      pattern: '[a-z]',
    });
    expect(console.warn).toHaveBeenLastCalledWith(
      'RegExp flags are not supported by JSON Schema.'
    );
  });

  test('should convert title action', () => {
    expect(convertAction({}, v.title('test'), undefined)).toStrictEqual({
      title: 'test',
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
        v.value<v.ValueInput, true>(true),
        undefined
      )
    ).toStrictEqual({
      type: 'boolean',
      const: true,
    });
    expect(
      convertAction(
        { type: 'number' },
        v.value<v.ValueInput, 123>(123),
        undefined
      )
    ).toStrictEqual({
      type: 'number',
      const: 123,
    });
    expect(
      convertAction(
        { type: 'string' },
        v.value<v.ValueInput, 'foo'>('foo'),
        undefined
      )
    ).toStrictEqual({
      type: 'string',
      const: 'foo',
    });
  });

  test('should throw error for unsupported transform action', () => {
    const action = v.transform(parseInt);
    const error = 'The "transform" action cannot be converted to JSON Schema.';
    expect(() =>
      convertAction(
        {},
        // @ts-expect-error
        action,
        undefined
      )
    ).toThrowError(error);
    expect(() =>
      convertAction(
        {},
        // @ts-expect-error
        action,
        { errorMode: 'throw' }
      )
    ).toThrowError(error);
  });

  test('should warn error for unsupported transform action', () => {
    expect(
      convertAction(
        {},
        // @ts-expect-error
        v.transform(parseInt),
        { errorMode: 'warn' }
      )
    ).toStrictEqual({});
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "transform" action cannot be converted to JSON Schema.'
    );
    expect(
      convertAction(
        { type: 'string' },
        // @ts-expect-error
        v.transform(parseInt),
        { errorMode: 'warn' }
      )
    ).toStrictEqual({ type: 'string' });
    expect(console.warn).toHaveBeenLastCalledWith(
      'The "transform" action cannot be converted to JSON Schema.'
    );
  });

  test('should convert BIC action', () => {
    expect(convertAction({ type: 'string' }, v.bic(), undefined)).toStrictEqual(
      {
        type: 'string',
        pattern: v.BIC_REGEX.source,
      }
    );
  });

  test('should convert CUID2 action', () => {
    expect(
      convertAction({ type: 'string' }, v.cuid2(), undefined)
    ).toStrictEqual({
      type: 'string',
      pattern: v.CUID2_REGEX.source,
    });
  });

  test('should convert decimal action', () => {
    expect(
      convertAction({ type: 'string' }, v.decimal(), undefined)
    ).toStrictEqual({
      type: 'string',
      pattern: v.DECIMAL_REGEX.source,
    });
  });

  test('should convert digits action', () => {
    expect(
      convertAction({ type: 'string' }, v.digits(), undefined)
    ).toStrictEqual({
      type: 'string',
      pattern: v.DIGITS_REGEX.source,
    });
  });

  test('should convert empty action with strings', () => {
    expect(
      convertAction({ type: 'string' }, v.empty(), undefined)
    ).toStrictEqual({
      type: 'string',
      maxLength: 0,
    });
  });

  test('should convert empty action with arrays', () => {
    expect(
      convertAction({ type: 'array' }, v.empty(), undefined)
    ).toStrictEqual({
      type: 'array',
      maxItems: 0,
    });
  });

  test('should throw error for unsupported empty action', () => {
    const error = 'The "empty" action is not supported on type "number".';
    expect(() =>
      convertAction({ type: 'number' }, v.empty(), undefined)
    ).toThrowError(error);
  });
});
