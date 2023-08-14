import { describe, expect, test } from 'vitest';
import { emoji } from './emoji.ts';

describe('emoji', () => {
  const info = { reason: 'any' as const };

  test('should pass only emojis', () => {
    const validate = emoji();
    const value1 = '😀';
    expect(validate(value1, info)).toEqual({ output: value1 });
    const value2 = '👋🏼';
    expect(validate(value2, info)).toEqual({ output: value2 });
    const value3 = '😀👋🏼';
    expect(validate(value3, info)).toEqual({ output: value3 });
    const value4 = '✔️';
    expect(validate(value4, info)).toEqual({ output: value4 });

    expect(validate('emoji', info).issues?.length).toBe(1);
    expect(validate('e😀', info).issues?.length).toBe(1);
    expect(validate('👋🏼 ', info).issues?.length).toBe(1);
    expect(validate('😀 👋🏼', info).issues?.length).toBe(1);
  });

  test('should return custom error message', () => {
    const error = 'Value is not an emoji!';
    const validate = emoji(error);
    expect(validate('test', info).issues?.[0].message).toBe(error);
  });
});
