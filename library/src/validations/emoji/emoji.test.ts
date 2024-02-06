import { describe, expect, test } from 'vitest';
import { emoji } from './emoji.ts';

describe('emoji', () => {
  test('should pass only emojis', () => {
    const validate = emoji();
    const value1 = '😀';
    expect(validate._parse(value1).output).toBe(value1);
    const value2 = '👋🏼';
    expect(validate._parse(value2).output).toBe(value2);
    const value3 = '😀👋🏼';
    expect(validate._parse(value3).output).toBe(value3);
    const value4 = '✔️';
    expect(validate._parse(value4).output).toBe(value4);

    expect(validate._parse('emoji').issues).toBeTruthy();
    expect(validate._parse('e😀').issues).toBeTruthy();
    expect(validate._parse('👋🏼 ').issues).toBeTruthy();
    expect(validate._parse('😀 👋🏼').issues).toBeTruthy();
  });

  test('should return custom error message', () => {
    const error = 'Value is not an emoji!';
    const validate = emoji(error);
    expect(validate._parse('test').issues?.[0].context.message).toBe(error);
  });
});
