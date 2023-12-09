import { describe, expect, test } from 'vitest';
import { isIBAN } from './isIBAN.ts';

describe('isIBAN', () => {
  test('should return true for correct IBAN', () => {
    expect(isIBAN('AT483200000012345864')).toBe(true);
    expect(isIBAN('BE71096123456769')).toBe(true);
    expect(isIBAN('BG18RZBB91550123456789')).toBe(true);
    expect(isIBAN('HR1723600001101234565')).toBe(true);
    expect(isIBAN('CY21002001950000357001234567')).toBe(true);
    expect(isIBAN('CZ5508000000001234567899')).toBe(true);
    expect(isIBAN('DK9520000123456789')).toBe(true);
    expect(isIBAN('FI1410093000123458')).toBe(true);
    expect(isIBAN('FR7630006000011234567890189')).toBe(true);
    expect(isIBAN('DE75512108001245126199')).toBe(true);
    expect(isIBAN('GR9608100010000001234567890')).toBe(true);
    expect(isIBAN('HU93116000060000000012345676')).toBe(true);
    expect(isIBAN('IE64IRCE92050112345678')).toBe(true);
    expect(isIBAN('IT60X0542811101000000123456')).toBe(true);
    expect(isIBAN('LV97HABA0012345678910')).toBe(true);
    expect(isIBAN('LT601010012345678901')).toBe(true);
    expect(isIBAN('LU120010001234567891')).toBe(true);
    expect(isIBAN('MT31MALT01100000000000000000123')).toBe(true);
    expect(isIBAN('PL10105000997603123456789123')).toBe(true);
    expect(isIBAN('RO09BCYP0000001234567890')).toBe(true);
    expect(isIBAN('SK8975000000000012345671')).toBe(true);
    expect(isIBAN('SI56192001234567892')).toBe(true);
    expect(isIBAN('ES7921000813610123456789')).toBe(true);
    expect(isIBAN('SE7280000810340009783242')).toBe(true);
    expect(isIBAN('NL02ABNA0123456789')).toBe(true);
  });

  test('should return false for incorrect IBAN', () => {
    expect(isIBAN('')).toBe(false);
    expect(isIBAN('GB82WEST12345698')).toBe(false);
    expect(isIBAN('DE8937040044053201300')).toBe(false);
    expect(isIBAN('GB82 WEST 1234 5698 7654 32')).toBe(false);
    expect(isIBAN('XX82WEST12345698765432')).toBe(false);
    expect(isIBAN('GB82TEST12345698765432')).toBe(false);
    expect(isIBAN('FR7630006000011234567890289')).toBe(false);
    expect(isIBAN('abcdefghij1234567890')).toBe(false);
    expect(isIBAN('GB82!EST12345698765432')).toBe(false);
    expect(isIBAN('GB82!NL91ABNA0417164300')).toBe(false);
    expect(isIBAN('GB12 3456 7890 1234 5678 90')).toBe(false);
  });
});
