import { describe, expect, test } from 'vitest';
import {} from '../../schemas/index.ts';
import { customAsync } from '../../validations/index.ts';
import { forwardAsync } from './forwardAsync.ts';

describe('forwardAsync', () => {
  test('should forward issues to end of path list', async () => {
    type Input = { nested: { key: string } };
    const requirement = async () => false;
    const validate = forwardAsync<Input>(customAsync(requirement), [
      'nested',
      'key',
    ]);
    const result = await validate._parse({ nested: { key: 'value' } });
    expect(result).toEqual({
      issues: [
        {
          validation: 'custom',
          message: 'Invalid input',
          input: 'value',
          requirement,
          path: [
            {
              type: 'unknown',
              input: { nested: { key: 'value' } },
              key: 'nested',
              value: { key: 'value' },
            },
            {
              type: 'unknown',
              input: { key: 'value' },
              key: 'key',
              value: 'value',
            },
          ],
        },
      ],
    });
  });

  test('should stop forwarding if path input is undefined', async () => {
    type Input = { nested: { key: string }[] };
    const requirement = async () => false;
    const validate = forwardAsync<Input>(customAsync(requirement), [
      'nested',
      10,
      'key',
    ]);
    const result = await validate._parse({ nested: [{ key: 'value' }] });
    expect(result).toEqual({
      issues: [
        {
          validation: 'custom',
          message: 'Invalid input',
          input: undefined,
          requirement,
          path: [
            {
              type: 'unknown',
              input: { nested: [{ key: 'value' }] },
              key: 'nested',
              value: [{ key: 'value' }],
            },
            {
              type: 'unknown',
              input: [{ key: 'value' }],
              key: 10,
              value: undefined,
            },
          ],
        },
      ],
    });
  });

  test('should do nothing if there are no issues', async () => {
    type Input = { nested: { key: string } };
    const requirement = async () => true;
    const validate = forwardAsync<Input>(customAsync(requirement), ['nested']);
    const input = { nested: { key: 'value' } };
    const result = await validate._parse(input);
    expect(result).toEqual({ output: input });
  });
});
