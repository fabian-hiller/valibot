import { describe, expect, test } from 'vitest';
import {
  deleteSchemaMessage,
  getSchemaMessage,
  setSchemaMessage,
} from './schemaMessage.ts';

describe('schemaMessage', () => {
  test('should set, get and delete message', () => {
    const lang = 'de';

    // Should be undefined initially
    expect(getSchemaMessage()).toBeUndefined();
    expect(getSchemaMessage(lang)).toBeUndefined();

    // Set and get string message
    const message1 = 'Custom message';
    setSchemaMessage(message1);
    expect(getSchemaMessage()).toBe(message1);
    setSchemaMessage(message1, lang);
    expect(getSchemaMessage(lang)).toBe(message1);

    // Set and get function message
    const message2 = () => 'Custom message';
    setSchemaMessage(message2);
    expect(getSchemaMessage()).toBe(message2);
    setSchemaMessage(message2, lang);
    expect(getSchemaMessage(lang)).toBe(message2);

    // Should delete schema message
    deleteSchemaMessage();
    expect(getSchemaMessage()).toBeUndefined();
    deleteSchemaMessage(lang);
    expect(getSchemaMessage(lang)).toBeUndefined();
  });
});
