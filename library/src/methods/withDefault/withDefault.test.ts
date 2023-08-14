import { describe, expect, test } from 'vitest';
import { object, string } from '../../schemas/index.ts';
import { parse } from '../parse/index.ts';
import { withDefault } from './withDefault.ts';

describe('withDefault', () => {
  test('should use default value', () => {
    const schema1 = withDefault(string(), 'test');
    const output1 = parse(schema1, undefined);
    expect(output1).toBe('test');
    const input1 = 'hello';
    const output2 = parse(schema1, input1);
    expect(output2).toBe(input1);

    const schema2 = object({ test: schema1 });
    const output3 = parse(schema2, {});
    expect(output3).toEqual({ test: 'test' });
    const input2 = { test: 'hello' };
    const output4 = parse(schema2, input2);
    expect(output4).toEqual(input2);
  });
});
