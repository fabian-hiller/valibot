import { describe, expect, test } from 'vitest';
import { size } from './size.ts';

describe('size', () => {
  test('should pass only valid sizes', () => {
    const validate = size(2);

    const value1 = new Map().set(1, 1).set(2, 2);
    expect(validate(value1).output).toBe(value1);
    const value2 = new Set().add(1).add(2);
    expect(validate(value2).output).toBe(value2);

    expect(validate(new Map()).issue).toBeTruthy();
    expect(validate(new Set().add(1)).issue).toBeTruthy();
    expect(validate(new Set().add(1).add(2).add(3)).issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value size is not "2"!';
    const value = new Set().add(1);
    const validate = size(2, error);
    expect(validate(value).issue?.message).toBe(error);
  });
});
