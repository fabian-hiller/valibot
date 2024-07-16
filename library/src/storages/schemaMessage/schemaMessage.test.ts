import { describe, expect, test } from 'vitest';
import {
  deleteSchemaMessage,
  getSchemaMessage,
  setSchemaMessage,
} from './schemaMessage.ts';

describe('schemaMessage', () => {
  const lang = 'de';

  test('should be undefined initially', () => {
    expect(getSchemaMessage()).toBeUndefined();
    expect(getSchemaMessage(lang)).toBeUndefined();
  });

  test('should set and get string message', () => {
    const message1 = 'Custom message';
    setSchemaMessage(message1);
    expect(getSchemaMessage()).toBe(message1);
    setSchemaMessage(message1, lang);
    expect(getSchemaMessage(lang)).toBe(message1);
  });

  test('should set and get function message', () => {
    const message2 = () => 'Custom message';
    setSchemaMessage(message2);
    expect(getSchemaMessage()).toBe(message2);
    setSchemaMessage(message2, lang);
    expect(getSchemaMessage(lang)).toBe(message2);
  });

  test('should delete schema message', () => {
    deleteSchemaMessage();
    expect(getSchemaMessage()).toBeUndefined();
    deleteSchemaMessage(lang);
    expect(getSchemaMessage(lang)).toBeUndefined();
  });
});
