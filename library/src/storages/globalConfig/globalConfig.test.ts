import { describe, expect, test } from 'vitest';
import {
  deleteGlobalConfig,
  getGlobalConfig,
  type GlobalConfig,
  setGlobalConfig,
} from './globalConfig.ts';

describe('config', () => {
  test('should set and get global config', () => {
    // Should be undefined initially
    expect(getGlobalConfig()).toEqual({});

    // Create global config object
    const config: GlobalConfig = {
      lang: 'en',
      abortEarly: true,
      abortPipeEarly: false,
      skipPipe: false,
    };

    // Set and get global config
    setGlobalConfig(config);
    expect(getGlobalConfig()).toEqual(config);
    expect(getGlobalConfig({ lang: 'de' })).toEqual({ ...config, lang: 'de' });

    // Should delete global config
    deleteGlobalConfig();
    expect(getGlobalConfig()).toEqual({});
  });
});
