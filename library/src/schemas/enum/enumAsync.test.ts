import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { enumAsync } from './enumAsync.ts';

enum Direction {
  Left,
  Right,
}

describe('enumAsync', () => {
  test('should pass only enum values', async () => {
    const schema = enumAsync(Direction);
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
      parseAsync(enumAsync(Direction, error), 'test')
    ).rejects.toThrowError(error);
  });

  test('should expose the metadata', () => {
    const schema1 = enumAsync(Direction, { description: 'enum value' });
    expect(schema1.metadata).toEqual({ description: 'enum value' });

    const schema2 = enumAsync(Direction, {
      description: 'enum value',
      message: 'Value is not a enum!',
    });
    expect(schema2.metadata).toEqual({ description: 'enum value' });
    expect(schema2.message).toEqual('Value is not a enum!');

    const schema3 = enumAsync(Direction);
    expect(schema3.metadata).toBeUndefined();
  });
});
