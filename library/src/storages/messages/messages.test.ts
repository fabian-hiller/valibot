import { describe, expect, test } from 'vitest';
import {
  getGlobalMessage,
  getLocalMessage,
  setGlobalMessage,
  setLocalMessage,
} from './messages.ts';

describe('messages', () => {
  test('should set and get global message', () => {
    const lang = 'de';

    expect(getGlobalMessage()).toBeUndefined();
    expect(getGlobalMessage(lang)).toBeUndefined();

    const message1 = 'error message1';
    setGlobalMessage(message1);
    expect(getGlobalMessage()).toBe(message1);
    setGlobalMessage(message1, lang);
    expect(getGlobalMessage(lang)).toBe(message1);

    const message2 = () => 'error message1';
    setGlobalMessage(message2);
    expect(getGlobalMessage()).toBe(message2);
    setGlobalMessage(message2, lang);
    expect(getGlobalMessage(lang)).toBe(message2);

    // Cleanup global error message
    setGlobalMessage(undefined);
    expect(getGlobalMessage()).toBeUndefined();
    setGlobalMessage(undefined, lang);
    expect(getGlobalMessage(lang)).toBeUndefined();
  });

  test('should set and get local message', () => {
    const lang = 'de';
    const key = 'key';

    expect(getLocalMessage(key)).toBeUndefined();
    expect(getLocalMessage(key, lang)).toBeUndefined();

    const message1 = 'error message1';
    setLocalMessage(key, message1);
    expect(getLocalMessage(key)).toBe(message1);
    setLocalMessage(key, message1, lang);
    expect(getLocalMessage(key, lang)).toBe(message1);

    const message2 = () => 'error message1';
    setLocalMessage(key, message2);
    expect(getLocalMessage(key)).toBe(message2);
    setLocalMessage(key, message2, lang);
    expect(getLocalMessage(key, lang)).toBe(message2);

    // Cleanup local error message
    setLocalMessage(key, undefined);
    expect(getLocalMessage(key)).toBeUndefined();
    setLocalMessage(key, undefined, lang);
    expect(getLocalMessage(key, lang)).toBeUndefined();
  });
});
