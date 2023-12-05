import { describe, expect, test } from 'vitest';
import { actionOutput } from './actionOutput.ts';

describe('actionOutput', () => {
  test('should return output results', () => {
    const value1 = undefined;
    expect(actionOutput(value1)).toEqual({ output: value1 });
    const value2 = 'test';
    expect(actionOutput(value2)).toEqual({ output: value2 });
    const value3 = 123;
    expect(actionOutput(value3)).toEqual({ output: value3 });
    const value4 = { test: 123 };
    expect(actionOutput(value4)).toEqual({ output: value4 });
  });
});
