import { describe, expect, test } from 'vitest';
import { number, object, string } from '../../schemas/index.ts';
import type {
  Output,
  TypedSchemaResult,
  UntypedSchemaResult,
} from '../../types/index.ts';
import { maxValue, minLength, minValue } from '../../validations/index.ts';
import { transform } from './transform.ts';

describe('transform', () => {
  test('should transform string to number', () => {
    const schema = transform(string(), (value) => value.length);
    const output = schema._parse('hello');
    expect(output).toEqual({
      typed: true,
      output: 5,
      issues: undefined,
    });
  });

  test('should add new key to object', () => {
    const merge = { key2: 'test' };
    const schema = transform(object({ key1: string() }), (value) => ({
      ...value,
      ...merge,
    }));
    const input = { key1: 'hello' };
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: { ...input, ...merge },
      issues: undefined,
    });
  });

  test('should return type issue', () => {
    const schema = transform(string(), (output) => output.length);
    const input = 123;
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: false,
      output: input,
      issues: [
        {
          reason: 'type',
          context: 'string',
          origin: 'value',
          expected: 'string',
          received: '123',
          message: 'Invalid type: Expected string but received 123',
          input: input,
        },
      ],
    } satisfies UntypedSchemaResult);
  });

  test('should return string issue', () => {
    const schema = transform(
      string([minLength(10)]),
      (output) => output.length
    );
    const input = 'hello';
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: 5,
      issues: [
        {
          reason: 'string',
          context: 'min_length',
          origin: 'value',
          expected: '>=10',
          received: '5',
          message: 'Invalid length: Expected >=10 but received 5',
          input: input,
          requirement: 10,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
  });

  test('should skip validation argument', () => {
    const schema = transform(
      string([minLength(10)]),
      (output) => output.length,
      number([minValue(10)])
    );
    const input = 'hello';
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: 5,
      issues: [
        {
          reason: 'string',
          context: 'min_length',
          origin: 'value',
          expected: '>=10',
          received: '5',
          message: 'Invalid length: Expected >=10 but received 5',
          input: input,
          requirement: 10,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
  });

  test('should validate output with pipe', () => {
    const schema = transform(string(), (output) => output.length, [
      maxValue(5),
    ]);
    const input = '123456';
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: 6,
      issues: [
        {
          reason: 'number',
          context: 'max_value',
          origin: 'value',
          expected: '<=5',
          received: '6',
          message: 'Invalid value: Expected <=5 but received 6',
          input: 6,
          requirement: 5,
        },
      ],
    } satisfies TypedSchemaResult<Output<typeof schema>>);
  });

  test('should validate output with schema', () => {
    const schema = transform(
      string(),
      (output) => output.length,
      number([maxValue(5)])
    );
    const input = '123456';
    const result = schema._parse(input);
    expect(result).toEqual({
      typed: true,
      output: 6,
      issues: [
        {
          reason: 'number',
          context: 'max_value',
          origin: 'value',
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
