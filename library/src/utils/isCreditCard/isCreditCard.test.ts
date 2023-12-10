import { describe, expect, test } from 'vitest';
import { isCreditCard } from './isCreditCard.ts';

describe('isCreditCard', () => {
  test('should return true, if credit card is valid', () => {
    expect(isCreditCard('3742 4545 5400 126')).toBe(true); // Amex
    expect(isCreditCard('4539 1488 0343 6467')).toBe(true); // Visa
    expect(isCreditCard('5555 5555 5555 4444')).toBe(true); // MasterCard
    expect(isCreditCard('3714 4963 5398 431')).toBe(true); // Discover
    expect(isCreditCard('3530 1113 3330 0000')).toBe(true); // JCB
    expect(isCreditCard('4701 3222 1111 1234')).toBe(true); // Visa Debit
    expect(isCreditCard('4001 9192 5753 7193')).toBe(true); // Visa
    expect(isCreditCard('4005 5500 0000 0001')).toBe(true); // Visa
    expect(isCreditCard('3020 4169 3226 43')).toBe(true); // Diners Club
    expect(isCreditCard('3021 8047 1965 57')).toBe(true); // Diners Club
  });

  test('should return true, if credit card is invalid', () => {
    expect(isCreditCard('')).toBe(false);
    expect(isCreditCard('1234 5678 9012 3456')).toBe(false);
    expect(isCreditCard('4532 7597 3454 2975 123')).toBe(false);
    expect(isCreditCard('4532-8940-1234-5678')).toBe(false);
    expect(isCreditCard('3543 0505 5555 5555')).toBe(false);
    expect(isCreditCard('55555 5555 5555 4444')).toBe(false);
    expect(isCreditCard('4111 1111 1111 111')).toBe(false);
    expect(isCreditCard('abcd efgh ijkl mnop')).toBe(false);
    expect(isCreditCard('0000 0000 0000 0000')).toBe(false);
  });
});
