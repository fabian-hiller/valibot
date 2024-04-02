import { describe, expect, test } from 'vitest';
import { string } from '../../schemas/index.ts';
import {
  deleteSpecificMessage,
  getSpecificMessage,
  setSpecificMessage,
} from './specificMessage.ts';

describe('schemaMessage', () => {
  const reference = string;
  const lang = 'de';

  test('should be undefined initially', () => {
    expect(getSpecificMessage(reference)).toBeUndefined();
    expect(getSpecificMessage(reference, lang)).toBeUndefined();
  });

  test('should set and get string message', () => {
    const message1 = 'Custom message';
    setSpecificMessage(reference, message1);
    expect(getSpecificMessage(reference)).toBe(message1);
    setSpecificMessage(reference, message1, lang);
    expect(getSpecificMessage(reference, lang)).toBe(message1);
  });

  test('should set and get function message', () => {
    const message2 = () => 'Custom message';
    setSpecificMessage(reference, message2);
    expect(getSpecificMessage(reference)).toBe(message2);
    setSpecificMessage(reference, message2, lang);
    expect(getSpecificMessage(reference, lang)).toBe(message2);
  });

  test('should delete schema message', () => {
    deleteSpecificMessage(reference);
    expect(getSpecificMessage(reference)).toBeUndefined();
    deleteSpecificMessage(reference, lang);
    expect(getSpecificMessage(reference, lang)).toBeUndefined();
  });
});
