import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { nativeEnumAsync } from './nativeEnumAsync.ts';

enum Direction {
  Left,
  Right,
}

describe('nativeEnumAsync', () => {
  test('should pass only enum values', async () => {
    const schema = nativeEnumAsync(Direction);
    const input1 = Direction.Left;
    const output1 = await parseAsync(schema, input1);
    expect(output1).toBe(input1);
    const input2 = Direction.Right;
    const output2 = await parseAsync(schema, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema, 123)).rejects.toThrowError();
    await expect(parseAsync(schema, 'right')).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a enum value!';
    await expect(
      parseAsync(nativeEnumAsync(Direction, error), 'test')
    ).rejects.toThrowError(error);
  });
});
