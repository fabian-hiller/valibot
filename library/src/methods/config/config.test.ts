import { describe, expect, test, vi } from 'vitest';
import { objectAsync, string } from '../../schemas/index.ts';
import type { BaseIssue, Config } from '../../types/index.ts';
import { config } from './config.ts';

describe('config', () => {
  test('should override config of schema', () => {
    const schema = string();
    schema._run = vi.fn(schema._run);
    const dataset = { typed: false, value: 'foo' };
    const globalConfig: Omit<Config<BaseIssue<unknown>>, 'skipPipe'> = {
      lang: 'de',
    };
    const localConfig: Omit<Config<BaseIssue<unknown>>, 'skipPipe'> = {
      abortPipeEarly: true,
    };
    config(schema, localConfig)._run(dataset, globalConfig);
    expect(schema._run).toHaveBeenCalledWith(dataset, {
      ...globalConfig,
      ...localConfig,
    });
  });

  test('should override config of async schema', () => {
    const schema = objectAsync({ key: string() });
    schema._run = vi.fn(schema._run);
    const dataset = { typed: false, value: { key: 'foo' } };
    const globalConfig: Omit<Config<BaseIssue<unknown>>, 'skipPipe'> = {
      lang: 'de',
    };
    const localConfig: Omit<Config<BaseIssue<unknown>>, 'skipPipe'> = {
      abortEarly: true,
      lang: 'en',
    };
    config(schema, localConfig)._run(dataset, globalConfig);
    expect(schema._run).toHaveBeenCalledWith(dataset, {
      ...globalConfig,
      ...localConfig,
    });
  });
});
