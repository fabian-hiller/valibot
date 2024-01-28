import { describe, expect, test } from 'vitest';
import { getConfig, type GlobalConfig, setConfig } from './config.ts';

describe('config', () => {
  test('should set and get global config', () => {
    expect(getConfig()).toEqual({});
    const config: GlobalConfig = {
      lang: 'en',
      abortEarly: true,
      abortPipeEarly: false,
      skipPipe: false,
    };
    setConfig(config);
    expect(getConfig()).toEqual(config);
    expect(getConfig({ lang: 'de' })).toEqual({ ...config, lang: 'de' });
    setConfig(undefined);
    expect(getConfig()).toEqual({});
  });
});
