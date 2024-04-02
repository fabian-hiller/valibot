import { describe, expect, test } from 'vitest';
import { number, object, string } from '../../schemas/index.ts';
import { isOfType } from './isOfType.ts';

describe('isOfType', () => {
  test('should check string schema', () => {
    const schema = string();
    expect(isOfType('string', schema)).toBeTruthy();
    // @ts-expect-error
    expect(isOfType('number', schema)).toBeFalsy();
    // @ts-expect-error
    expect(isOfType('object', schema)).toBeFalsy();
  });

  test('should check number schema', () => {
    const schema = number();
    expect(isOfType('number', schema)).toBeTruthy();
    // @ts-expect-error
    expect(isOfType('string', schema)).toBeFalsy();
    // @ts-expect-error
    expect(isOfType('object', schema)).toBeFalsy();
  });

  test('should check object schema', () => {
    const schema = object({ key: string() });
    expect(isOfType('object', schema)).toBeTruthy();
    // @ts-expect-error
    expect(isOfType('string', schema)).toBeFalsy();
    // @ts-expect-error
    expect(isOfType('number', schema)).toBeFalsy();
  });
});
