import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods';
import { unknownAsync } from './unknownAsync';

describe('unknownAsync', () => {
  test('should pass unknown values', async () => {
    const schema = unknownAsync();
    const input1 = 'hello';
    const output1 = await parseAsync(schema, input1);
    expect(output1).toBe(input1);
    const input2 = 123;
    const output2 = await parseAsync(schema, input2);
    expect(output2).toBe(input2);
    const input3 = { test: 123 };
    const output3 = await parseAsync(schema, input3);
    expect(output3).toEqual(input3);
  });

  test('should execute pipe', async () => {
    const transformInput = () => 'hello';
    const output = await parseAsync(unknownAsync([transformInput]), 123);
    expect(output).toBe(transformInput());
  });
});
