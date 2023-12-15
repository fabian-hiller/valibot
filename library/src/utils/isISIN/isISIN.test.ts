import { describe, expect, test } from 'vitest';
import { isISIN } from './isISIN.ts';

describe('isISIN', () => {
  test('should return true for valid ISIN', () => {
    expect(isISIN('US0378331005')).toBe(true);
    expect(isISIN('GB0002634946')).toBe(true);
    expect(isISIN('CA0585861085')).toBe(true);
    expect(isISIN('DE0008430026')).toBe(true);
    expect(isISIN('JP3910660004')).toBe(true);
    expect(isISIN('AU0000XVGZA3')).toBe(true);
    expect(isISIN('CH0044328745')).toBe(true);
    expect(isISIN('SE0000108656')).toBe(true);
    expect(isISIN('NL0000009165')).toBe(true);
  });

  test('should return false for invalid ISIN', () => {
    expect(isISIN('')).toBe(false);
    expect(isISIN('US1234567890')).toBe(false);
    expect(isISIN('XX0002634946')).toBe(false);
    expect(isISIN('CA058586108')).toBe(false);
    expect(isISIN('DE00A8430026')).toBe(false);
    expect(isISIN('FR00001202710')).toBe(false);
    expect(isISIN('JP391066000Z')).toBe(false);
    expect(isISIN('AU000XVGZA3A')).toBe(false);
    expect(isISIN('CH00443287452')).toBe(false);
    expect(isISIN('SE00001086566')).toBe(false);
    expect(isISIN('NL0000009165A')).toBe(false);
  });
});
