import { describe, expect, test } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { custom, customAsync } from '../../validations/index.ts';
import { specialAsync } from './specialAsync.ts';

type PixelString = `${number}px`;
const isPixelString = (input: unknown) =>
  typeof input === 'string' && /^\d+px$/.test(input);

describe('specialAsync', () => {
  test('should pass only pixel strings', async () => {
    const schema = specialAsync<PixelString>(isPixelString);
    const input = '12px';
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    await expect(parseAsync(schema, 12)).rejects.toThrowError();
    await expect(parseAsync(schema, '12')).rejects.toThrowError();
    await expect(parseAsync(schema, 'px')).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should throw custom error', async () => {
    const error = 'Value is not special!';
    await expect(
      parseAsync(
        specialAsync(() => false, error),
        'test'
      )
    ).rejects.toThrowError(error);
  });

  test('should execute pipe', async () => {
    const inputError = 'Invalid input';

    const schema1 = specialAsync<PixelString>(isPixelString, [
      customAsync(async (input) => parseInt(input) >= 10),
    ]);
    const input1 = '10px';
    const output1 = await parseAsync(schema1, input1);
    expect(output1).toBe(input1);
    await expect(parseAsync(schema1, '9px')).rejects.toThrowError(inputError);

    const schema2 = specialAsync<PixelString>(isPixelString, 'Error', [
      custom((input) => parseInt(input) < 10),
    ]);
    const input2 = '9px';
    const output2 = await parseAsync(schema2, input2);
    expect(output2).toBe(input2);
    await expect(parseAsync(schema2, '10px')).rejects.toThrowError(inputError);
  });
});
