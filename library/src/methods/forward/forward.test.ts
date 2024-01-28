import { describe, expect, test } from 'vitest';
import { custom } from '../../validations/index.ts';
import { forward } from './forward.ts';

describe('forward', () => {
  test('should forward issues to end of path list', () => {
    type Input = { nested: { key: string } };
    const requirement = () => false;
    const validate = forward<Input>(custom(requirement, 'Custom error'), [
      'nested',
      'key',
    ]);
    const result = validate._parse({ nested: { key: 'value' } });
    expect(result).toEqual({
      issues: [
        {
          context: {
            type: 'custom',
            expects: null,
            async: false,
            message: 'Custom error',
            requirement,
            _parse: expect.any(Function),
          },
          input: 'value',
          label: 'input',
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

  test('should stop forwarding if path input is undefined', () => {
    type Input = { nested: { key: string }[] };
    const requirement = () => false;
    const validate = forward<Input>(custom(requirement, 'Custom error'), [
      'nested',
      10,
      'key',
    ]);
    const result = validate._parse({ nested: [{ key: 'value' }] });
    expect(result).toEqual({
      issues: [
        {
          context: {
            type: 'custom',
            expects: null,
            async: false,
            message: 'Custom error',
            requirement,
            _parse: expect.any(Function),
          },
          input: undefined,
          label: 'input',
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

  test('should do nothing if there are no issues', () => {
    type Input = { nested: { key: string } };
    const requirement = () => true;
    const validate = forward<Input>(custom(requirement), ['nested']);
    const input = { nested: { key: 'value' } };
    const result = validate._parse(input);
    expect(result).toEqual({ output: input });
  });
});
