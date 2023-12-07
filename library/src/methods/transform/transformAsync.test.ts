import { describe, expect, test } from 'vitest';
import { number, object, string } from '../../schemas/index.ts';
import { maxValue, minLength, minValue } from '../../validations/index.ts';
import { transformAsync } from './transformAsync.ts';

describe('transformAsync', () => {
  test('should transformAsync string to number', async () => {
    const schema = transformAsync(string(), (value) => value.length);
    const output = await schema._parse('hello');
    expect(output).toEqual({
      typed: true,
      output: 5,
      issues: undefined,
    });
  });

  test('should add new key to object', async () => {
    const merge = { key2: 'test' };
    const schema = transformAsync(object({ key1: string() }), (value) => ({
      ...value,
      ...merge,
    }));
    const input = { key1: 'hello' };
    const result = await schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: { ...input, ...merge },
      issues: undefined,
    });
  });

  test('should return type issue', async () => {
    const schema = transformAsync(string(), (output) => output.length);
    const input = 123;
    const result = await schema._parse(input);
    expect(result).toEqual({
      typed: false,
      output: input,
      issues: [
        {
          reason: 'type',
          validation: 'string',
          origin: 'value',
          message: 'Invalid type',
          input: input,
        },
      ],
    });
  });

  test('should return string issue', async () => {
    const schema = transformAsync(
      string([minLength(10)]),
      (output) => output.length
    );
    const input = 'hello';
    const result = await schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: 5,
      issues: [
        {
          reason: 'string',
          validation: 'min_length',
          origin: 'value',
          message: 'Invalid length',
          input: input,
          requirement: 10,
        },
      ],
    });
  });

  test('should skip validation argument', async () => {
    const schema = transformAsync(
      string([minLength(10)]),
      (output) => output.length,
      number([minValue(10)])
    );
    const input = 'hello';
    const result = await schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: 5,
      issues: [
        {
          reason: 'string',
          validation: 'min_length',
          origin: 'value',
          message: 'Invalid length',
          input: input,
          requirement: 10,
        },
      ],
    });
  });

  test('should validate output with pipe', async () => {
    const schema = transformAsync(string(), (output) => output.length, [
      maxValue(5),
    ]);
    const input = '123456';
    const result = await schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: 6,
      issues: [
        {
          reason: 'number',
          validation: 'max_value',
          origin: 'value',
          message: 'Invalid value',
          input: 6,
          requirement: 5,
        },
      ],
    });
  });

  test('should validate output with schema', async () => {
    const schema = transformAsync(
      string(),
      (output) => output.length,
      number([maxValue(5)])
    );
    const input = '123456';
    const result = await schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: 6,
      issues: [
        {
          reason: 'number',
          validation: 'max_value',
          origin: 'value',
          message: 'Invalid value',
          input: 6,
          requirement: 5,
        },
      ],
    });
  });
});
