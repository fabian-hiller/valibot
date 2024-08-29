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
    expect(convertAction({}, v.email(), undefined)).toStrictEqual({
      format: 'email',
    });
    expect(
      convertAction({ type: 'string' }, v.email(), undefined)
    ).toStrictEqual({
      type: 'string',
      format: 'email',
    });
  });

  test('should convert integer action', () => {
    expect(convertAction({}, v.integer(), undefined)).toStrictEqual({
      type: 'integer',
    });
    expect(
      convertAction({ type: 'number' }, v.integer(), undefined)
    ).toStrictEqual({
      type: 'integer',
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
