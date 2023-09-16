import { describe, expect, test } from 'vitest';
import { getOutput } from './getOutput.ts';

describe('getOutput', () => {
  test('should return output results', () => {
    const value1 = undefined;
    expect(getOutput(value1)).toEqual({ output: value1 });
    const value2 = 'test';
    expect(getOutput(value2)).toEqual({ output: value2 });
    const value3 = 123;
    expect(getOutput(value3)).toEqual({ output: value3 });
    const value4 = { test: 123 };
    expect(getOutput(value4)).toEqual({ output: value4 });
  });
});
