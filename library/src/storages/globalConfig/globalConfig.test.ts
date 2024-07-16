import { describe, expect, test } from 'vitest';
import {
  deleteGlobalConfig,
  getGlobalConfig,
  type GlobalConfig,
  setGlobalConfig,
} from './globalConfig.ts';

describe('config', () => {
  const config: GlobalConfig = {
    lang: 'en',
    abortEarly: true,
    abortPipeEarly: false,
  };

  test('should be undefined initially', () => {
    expect(getGlobalConfig()).toEqual({});
  });

  test('should set and get global config', () => {
    setGlobalConfig(config);
    expect(getGlobalConfig()).toEqual(config);
  });

  test('should merge config argument', () => {
    expect(getGlobalConfig({ lang: 'de' })).toEqual({ ...config, lang: 'de' });
  });

  test('should delete global config', () => {
    deleteGlobalConfig();
    expect(getGlobalConfig()).toEqual({});
  });
});
