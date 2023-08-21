import { describe, expect, test } from 'vitest';
import { object, string } from '../../schemas/index.ts';
import { parse } from '../parse/index.ts';
import { withDefault } from './withDefault.ts';

describe('withDefault', () => {
  const schema1 = withDefault(string(), 'test');
  const schema2 = object({ test: schema1 });

  test('should use default value', () => {
    const output1 = parse(schema1, undefined);
    expect(output1).toBe('test');
    const output2 = parse(schema2, {});
    expect(output2).toEqual({ test: 'test' });
  });

  test('should not use default value', () => {
    const input1 = 'hello';
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);
    const input2 = { test: 'hello' };
    const output2 = parse(schema2, input2);
    expect(output2).toEqual(input2);
  });
});
