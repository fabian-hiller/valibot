import { describe, expect, test, vi } from 'vitest';
import { objectAsync, string } from '../../schemas/index.ts';
import type { BaseIssue, Config } from '../../types/index.ts';
import { message } from './message.ts';

describe('message', () => {
  test('should override config of schema', () => {
    const schema = string();
    // @ts-expect-error
    schema['~run'] = vi.fn(schema['~run']);
    const dataset = { value: 'foo' };
    const globalConfig: Config<BaseIssue<unknown>> = {
      message: 'global config error',
    };
    const errorMessage = 'local config error';
    message(schema, errorMessage)['~run'](dataset, globalConfig);
    expect(schema['~run']).toHaveBeenCalledWith(dataset, {
      ...globalConfig,
      message: errorMessage,
    });
  });

  test('should override config of async schema', () => {
    const schema = objectAsync({ key: string() });
    // @ts-expect-error
    schema['~run'] = vi.fn(schema['~run']);
    const dataset = { value: { key: 'foo' } };
    const globalConfig: Config<BaseIssue<unknown>> = {
      message: 'global config error',
    };
    const errorMessage = 'local config error';
    message(schema, errorMessage)['~run'](dataset, globalConfig);
    expect(schema['~run']).toHaveBeenCalledWith(dataset, {
      ...globalConfig,
      message: errorMessage,
    });
  });
});
