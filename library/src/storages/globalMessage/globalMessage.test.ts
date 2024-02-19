import { describe, expect, test } from 'vitest';
import {
  deleteGlobalMessage,
  getGlobalMessage,
  setGlobalMessage,
} from './globalMessage.ts';

describe('globalMessage', () => {
  test('should set, get and delete message', () => {
    const lang = 'de';

    // Should be undefined initially
    expect(getGlobalMessage()).toBeUndefined();
    expect(getGlobalMessage(lang)).toBeUndefined();

    // Set and get string message
    const message1 = 'Custom message';
    setGlobalMessage(message1);
    expect(getGlobalMessage()).toBe(message1);
    setGlobalMessage(message1, lang);
    expect(getGlobalMessage(lang)).toBe(message1);

    // Set and get function message
    const message2 = () => 'Custom message';
    setGlobalMessage(message2);
    expect(getGlobalMessage()).toBe(message2);
    setGlobalMessage(message2, lang);
    expect(getGlobalMessage(lang)).toBe(message2);

    // Should delete global message
    deleteGlobalMessage();
    expect(getGlobalMessage()).toBeUndefined();
    deleteGlobalMessage(lang);
    expect(getGlobalMessage(lang)).toBeUndefined();
  });
});
