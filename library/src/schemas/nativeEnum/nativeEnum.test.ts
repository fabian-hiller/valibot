import { describe, expect, test } from 'vitest';
import { parse } from '../../methods';
import { nativeEnum } from './nativeEnum';

enum Direction {
  Left,
  Right,
}

describe('nativeEnum', () => {
  test('should pass only enum values', () => {
    const schema = nativeEnum(Direction);
    const input1 = Direction.Left;
    const output1 = parse(schema, input1);
    expect(output1).toBe(input1);
    const input2 = Direction.Right;
    const output2 = parse(schema, input2);
    expect(output2).toBe(input2);
    expect(() => parse(schema, 123)).toThrowError();
    expect(() => parse(schema, 'right')).toThrowError();
    expect(() => parse(schema, {})).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not a enum value!';
    expect(() => parse(nativeEnum(Direction, error), 'test')).toThrowError(
      error
    );
  });
});
