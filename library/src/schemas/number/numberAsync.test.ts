import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { maxValue, minValue } from '../../validations/index.ts';
import { numberAsync } from './numberAsync.ts';

describe('numberAsync', () => {
  test('should pass only numbers', async () => {
    const schema = numberAsync();
    const input = 123;
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    await expect(parseAsync(schema, 123n)).rejects.toThrowError();
    await expect(parseAsync(schema, '123')).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
    await expect(parseAsync(schema, NaN)).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not a number!';
    await expect(parseAsync(numberAsync(error), 'test')).rejects.toThrowError(
      error
    );
  });

  test('should execute pipe', async () => {
    const valueError = 'Invalid value';

    const schema1 = numberAsync([minValue(1), maxValue(3)]);
    const input1 = 2;
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toBe(input1);
    await expect(parseAsync(schema1, 0)).rejects.toThrowError(valueError);
    await expect(parseAsync(schema1, 12)).rejects.toThrowError(valueError);

    const schema2 = numberAsync('Error', [maxValue(3)]);
    const input2 = 3;
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema2, 12346789)).rejects.toThrowError(
      valueError
    );
  });
});
