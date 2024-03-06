import { describe, expect, test } from 'vitest';
import { number, object, string } from '../../schemas/index.ts';
import { isOfType } from './isOfType.ts';

describe('isOfType', () => {
  test('should check string schema', () => {
    const schema = string();
    expect(isOfType('string', schema)).toBeTruthy();
    expect(isOfType('number', schema)).toBeFalsy();
    expect(isOfType('object', schema)).toBeFalsy();
  });

  test('should check number schema', () => {
    const schema = number();
    expect(isOfType('number', schema)).toBeTruthy();
    expect(isOfType('string', schema)).toBeFalsy();
    expect(isOfType('object', schema)).toBeFalsy();
  });

  test('should check object schema', () => {
    const schema = object({ key: string() });
    expect(isOfType('object', schema)).toBeTruthy();
    expect(isOfType('string', schema)).toBeFalsy();
    expect(isOfType('number', schema)).toBeFalsy();
  });
});
