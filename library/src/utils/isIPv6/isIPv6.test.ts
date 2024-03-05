import { describe, expect, test } from 'vitest';
import { isIPv6 } from './isIPv6.ts';

describe('isLuhnAlgo', () => {
  test('should return true for valid ip6 addresses', () => {
    expect(isIPv6('5f1d:3a90:b3e3:8132:8ab8:d938:8aa4:3c28')).toBe(true);
    expect(isIPv6('2826:ef4e:e916:5681:4feb:e46e:017d:d04b')).toBe(true);
    expect(isIPv6('0d23:27eb:dc83:0718:14ed:6a51:d66d:861e')).toBe(true);
    expect(isIPv6('9ace:076d:7df5:6259:c70d:e089:c0d5:9e9b')).toBe(true);
    expect(isIPv6('9ace:076d:7df5:6259:c70d:e089:c0d5:9e9b')).toBe(true);
    expect(isIPv6('c5a8:e5ba:f052:b952:4d85:725e:df5a:6377')).toBe(true);
    expect(isIPv6('FE80:0000:0000:0000:0202:B3FF:FE1E:8329')).toBe(true);
    expect(isIPv6('fe80::1ff:fe23:4567:890a')).toBe(true);
  });

  test('should return false for invalid ip6 addresses', () => {
    expect(isIPv6('')).toBe(false);
    expect(isIPv6('127.0.0.1')).toBe(false);
    expect(isIPv6('192.168.0.1')).toBe(false);
    expect(isIPv6('0.0.0.0')).toBe(false);
    expect(isIPv6('test:test:test:test:test:test:test:test')).toBe(false);
    expect(isIPv6('fe80::3:bEFf:5b:%3NG')).toBe(false);
  });
});
