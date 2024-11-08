import { describe, expect, test, vi } from 'vitest';
import { objectAsync, string } from '../../schemas/index.ts';
import type { BaseIssue, Config } from '../../types/index.ts';
import { config } from './config.ts';

describe('config', () => {
  test('should override config of schema', () => {
    const schema = string();
    // @ts-expect-error
    schema['~run'] = vi.fn(schema['~run']);
    const dataset = { value: 'foo' };
    const globalConfig: Config<BaseIssue<unknown>> = {
      lang: 'de',
    };
    const localConfig: Config<BaseIssue<unknown>> = {
      abortPipeEarly: true,
    };
    config(schema, localConfig)['~run'](dataset, globalConfig);
    expect(schema['~run']).toHaveBeenCalledWith(dataset, {
      ...globalConfig,
      ...localConfig,
    });
  });

  test('should override config of async schema', () => {
    const schema = objectAsync({ key: string() });
    // @ts-expect-error
    schema['~run'] = vi.fn(schema['~run']);
    const dataset = { value: { key: 'foo' } };
    const globalConfig: Config<BaseIssue<unknown>> = {
      lang: 'de',
    };
    const localConfig: Config<BaseIssue<unknown>> = {
      abortEarly: true,
      lang: 'en',
    };
    config(schema, localConfig)['~run'](dataset, globalConfig);
    expect(schema['~run']).toHaveBeenCalledWith(dataset, {
      ...globalConfig,
      ...localConfig,
    });
  });
});
