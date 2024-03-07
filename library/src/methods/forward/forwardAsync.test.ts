import { describe, expect, test } from 'vitest';
import '../../schemas/index.ts';
import { customAsync } from '../../validations/index.ts';
import { forwardAsync } from './forwardAsync.ts';

describe('forwardAsync', () => {
  test('should forward issues to end of path list', async () => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Input = { nested: { key: string } };
    const requirement = async () => false;
    const validate = forwardAsync<Input>(
      customAsync(requirement, 'Custom error'),
      ['nested', 'key']
    );
    const result = await validate._parse({ nested: { key: 'value' } });
    expect(result).toEqual({
      issues: [
        {
          context: {
            type: 'custom',
            expects: null,
            async: true,
            message: 'Custom error',
            requirement,
            _parse: expect.any(Function),
          },
          reference: expect.any(Function),
          input: 'value',
          label: 'input',
          path: [
            {
              type: 'unknown',
              origin: 'value',
              input: { nested: { key: 'value' } },
              key: 'nested',
              value: { key: 'value' },
            },
            {
              type: 'unknown',
              origin: 'value',
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
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Input = { nested: { key: string }[] };
    const requirement = async () => false;
    const validate = forwardAsync<Input>(
      customAsync(requirement, 'Custom error'),
      ['nested', 10, 'key']
    );
    const result = await validate._parse({ nested: [{ key: 'value' }] });
    expect(result).toEqual({
      issues: [
        {
          context: {
            type: 'custom',
            expects: null,
            async: true,
            message: 'Custom error',
            requirement,
            _parse: expect.any(Function),
          },
          reference: expect.any(Function),
          input: undefined,
          label: 'input',
          path: [
            {
              type: 'unknown',
              origin: 'value',
              input: { nested: [{ key: 'value' }] },
              key: 'nested',
              value: [{ key: 'value' }],
            },
            {
              type: 'unknown',
              origin: 'value',
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
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    type Input = { nested: { key: string } };
    const requirement = async () => true;
    const validate = forwardAsync<Input>(customAsync(requirement), ['nested']);
    const input = { nested: { key: 'value' } };
    const result = await validate._parse(input);
    expect(result).toEqual({ output: input });
  });
});
