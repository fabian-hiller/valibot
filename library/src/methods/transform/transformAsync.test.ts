import { describe, expect, test } from 'vitest';
import { number, object, string } from '../../schemas/index.ts';
import type {
  Output,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
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
          context: 'string',
          expected: 'string',
          received: '123',
          message: 'Invalid type: Expected string but received 123',
          input: input,
        },
      ],
    } satisfies UntypedSchemaResult);
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
          context: 'min_length',
          expected: '>=10',
          received: '5',
          message: 'Invalid length: Expected >=10 but received 5',
          input: input,
          requirement: 10,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
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
          context: 'min_length',
          expected: '>=10',
          received: '5',
          message: 'Invalid length: Expected >=10 but received 5',
          input: input,
          requirement: 10,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
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
          context: 'max_value',
          expected: '<=5',
          received: '6',
          message: 'Invalid value: Expected <=5 but received 6',
          input: 6,
          requirement: 5,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
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
          context: 'max_value',
          expected: '<=5',
          received: '6',
          message: 'Invalid value: Expected <=5 but received 6',
          input: 6,
          requirement: 5,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
  });
});
