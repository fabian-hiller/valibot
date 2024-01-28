import { describe, expect, test } from 'vitest';
import { stringify } from './stringify.ts';

describe('stringify', () => {
  test('should return string literal', () => {
    expect(stringify('hello')).toBe('"hello"');
  });

  test('should return number literal', () => {
    expect(stringify(123)).toBe('123');
  });

  test('should return bigint literal', () => {
    expect(stringify(123n)).toBe('123');
  });

  test('should return boolean literal', () => {
    expect(stringify(true)).toBe('true');
    expect(stringify(false)).toBe('false');
  });

  test('should return type of symbol', () => {
    expect(stringify(Symbol('foo'))).toBe('symbol');
  });

  test('should return type of function', () => {
    expect(stringify(() => null)).toBe('function');
  });

  test('should return type of undefined', () => {
    expect(stringify(undefined)).toBe('undefined');
  });

  test('should return Object constructor name', () => {
    expect(stringify({})).toBe('Object');
  });

  test('should return Array constructor name', () => {
    expect(stringify([])).toBe('Array');
  });

  test('should return Date constructor name', () => {
    expect(stringify(new Date())).toBe('Date');
  });

  test('should return null as string', () => {
    expect(stringify(null)).toBe('null');
  });
});
