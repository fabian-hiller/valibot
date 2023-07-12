import { describe, expect, test } from 'vitest';
import { emoji } from './emoji';

describe('emoji', () => {
  const info = { reason: 'any' as const };

  test('should pass only emojis', () => {
    const validate = emoji();
    const value1 = '😀';
    expect(validate(value1, info)).toBe(value1);
    const value2 = '👋🏼';
    expect(validate(value2, info)).toBe(value2);
    const value3 = '😀👋🏼';
    expect(validate(value3, info)).toBe(value3);
    const value4 = '✔️';
    expect(validate(value4, info)).toBe(value4);

    expect(() => validate('emoji', info)).toThrowError();
    expect(() => validate('e😀', info)).toThrowError();
    expect(() => validate('👋🏼 ', info)).toThrowError();
    expect(() => validate('😀 👋🏼', info)).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an emoji!';
    const validate = emoji(error);
    expect(() => validate('test', info)).toThrowError(error);
  });
});
