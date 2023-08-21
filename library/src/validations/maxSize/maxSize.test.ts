import { describe, expect, test } from 'vitest';
import { maxSize } from './maxSize.ts';

describe('maxSize', () => {
  test('should pass only valid sizes', () => {
    const validate = maxSize(3);

    const value1 = new Map();
    expect(validate(value1).output).toBe(value1);
    const value2 = new Map().set(1, 1).set(2, 2).set(3, 3);
    expect(validate(value2).output).toBe(value2);
    const value3 = new Set();
    expect(validate(value3).output).toBe(value3);
    const value4 = new Set().add(1).add(2).add(3);
    expect(validate(value4).output).toBe(value4);

    expect(validate(value2.set(4, 4)).issue).toBeTruthy();
    expect(validate(value4.add(4)).issue).toBeTruthy();
    expect(validate(value4.add(5)).issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value size is greater than "2"!';
    const value = new Set().add(1).add(2).add(3);
    const validate = maxSize(2, error);
    expect(validate(value).issue?.message).toBe(error);
  });
});
