import { describe, expect, test } from 'vitest';
import { emoji } from './emoji.ts';

describe('emoji', () => {
  test('should pass only emojis', () => {
    const validate = emoji();
    const value1 = '😀';
    expect(validate(value1).output).toBe(value1);
    const value2 = '👋🏼';
    expect(validate(value2).output).toBe(value2);
    const value3 = '😀👋🏼';
    expect(validate(value3).output).toBe(value3);
    const value4 = '✔️';
    expect(validate(value4).output).toBe(value4);

    expect(validate('emoji').issue).toBeTruthy();
    expect(validate('e😀').issue).toBeTruthy();
    expect(validate('👋🏼 ').issue).toBeTruthy();
    expect(validate('😀 👋🏼').issue).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an emoji!';
    const validate = emoji(error);
    expect(validate('test').issue?.message).toBe(error);
  });
});
