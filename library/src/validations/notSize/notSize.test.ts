import { describe, expect, test } from 'vitest';
import { notSize } from './notSize.ts';

describe('notSize', () => {
  test('should pass only valid sizes', () => {
    const validate = notSize(2);

    const value1 = new Map().set(1, 1);
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = new Map().set(1, 1).set(2, 2).set(3, 3);
    expect(validate._parse(value2).output).toBe(value2);

    const value3 = new Set().add(1);
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = new Set().add(1).add(2).add(3);
    expect(validate._parse(value4).output).toBe(value4);

    expect(validate._parse(new Map().set(1, 1).set(2, 2)).issues).toBeTruthy();
    expect(validate._parse(new Set().add(1).add(2)).issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value size is "2"!';
    const validate = notSize(2, error);
    expect(validate._parse(new Set().add(1).add(2)).issues?.[0].message).toBe(
      error
    );
  });
});
