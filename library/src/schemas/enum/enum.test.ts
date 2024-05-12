import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { enum_ } from './enum.ts';

enum Direction {
  Left,
  Right,
}

describe('enum_', () => {
  test('should pass only enum values', () => {
    const schema = enum_(Direction);
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
    expect(() => parse(enum_(Direction, error), 'test')).toThrowError(error);
  });

  test('should expose the metadata', () => {
    const schema1 = enum_(Direction, { description: 'enum value' });
    expect(schema1.metadata).toEqual({ description: 'enum value' });

    const schema2 = enum_(Direction, {
      description: 'enum value',
      message: 'Value is not a enum!',
    });
    expect(schema2.metadata).toEqual({ description: 'enum value' });
    expect(schema2.message).toEqual('Value is not a enum!');

    const schema3 = enum_(Direction);
    expect(schema3.metadata).toBeUndefined();
  });
});
