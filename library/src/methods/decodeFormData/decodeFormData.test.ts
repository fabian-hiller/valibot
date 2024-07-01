import { describe, expect, test } from 'vitest';
import {
  array,
  bigint,
  boolean,
  date,
  instance,
  number,
  object,
  optional,
  string,
} from '../../schemas/index.ts';
import { decodeFormData } from './decodeFormData.ts';

describe('decodeFormData', () => {
  describe('should decode primitives', () => {
    test('string', () => {
      const schema = object({
        key1: string(),
        key2: string(),
        key3: string(),
      });
      const input = new FormData();
      input.append('key1', 'foo');
      input.append('key2', '');
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({ key1: 'foo', key2: null });
    });

    test('number', () => {
      const schema = object({
        key1: number(),
        key2: number(),
        key3: number(),
        key4: number(),
      });
      const input = new FormData();
      input.append('key1', '123');
      input.append('key2', '-4.56');
      input.append('key3', 'invalid');
      input.append('key4', '');
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({
        key1: 123,
        key2: -4.56,
        key3: 'invalid',
        key4: null,
      });
    });

    test('bigint', () => {
      const schema = object({
        key1: bigint(),
        key2: bigint(),
        key3: bigint(),
        key4: bigint(),
        key5: bigint(),
      });
      const input = new FormData();
      input.append('key1', '2147483647');
      input.append('key2', '-92233720368547758074');
      input.append('key3', 'invalid');
      input.append('key4', '');
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({
        key1: 2147483647n,
        key2: -92233720368547758074n,
        key3: 'invalid',
        key4: null,
      });
    });

    test('boolean', () => {
      const schema = object({
        key1: boolean(),
        key2: boolean(),
        key3: boolean(),
        key4: boolean(),
        key5: boolean(),
      });
      const input = new FormData();
      input.append('key1', 'true');
      input.append('key2', 'false');
      input.append('key3', 'invalid');
      input.append('key4', '');
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({
        key1: true,
        key2: false,
        key3: 'invalid',
        key4: null,
      });
    });

    test('date', () => {
      const schema = object({
        key1: date(),
        key2: date(),
        key3: date(),
        key4: date(),
        key5: date(),
      });
      const input = new FormData();
      input.append('key1', '2021-01-01T00:00:00Z');
      input.append('key2', '1609459200000');
      input.append('key3', 'invalid');
      input.append('key4', '');
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({
        key1: new Date(1609459200000),
        key2: new Date(1609459200000),
        key3: 'invalid',
        key4: null,
      });
    });

    test('file', () => {
      const schema = object({ key: instance(File) });
      const input = new FormData();
      input.append('key', new File(['foo'], 'bar.txt', { type: 'text/plain' }));
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({
        key: new File(['bar'], 'baz.txt', { type: 'text/plain' }),
      });
    });
  });

  describe('should decode complex types', () => {
    test('object', () => {
      const schema = object({ key: object({ nested: string() }) });
      const input = new FormData();
      input.append('key.nested', 'foo');
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({
        key: { nested: 'foo' },
      });
    });

    test('nested object', () => {
      const schema = object({
        key: object({ nested: object({ deep: string() }) }),
      });
      const input = new FormData();
      input.append('key.nested.deep', 'foo');
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({
        key: { nested: { deep: 'foo' } },
      });
    });

    test('array', () => {
      const schema = object({ key: array(string()) });
      const input = new FormData();
      input.append('key', 'foo');
      input.append('key', 'bar');
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({
        key: ['foo', 'bar'],
      });
    });

    test('nested array', () => {
      const schema = object({
        key: array(object({ nested: array(number()) })),
      });
      const input = new FormData();
      input.append('key.0.nested', '1');
      input.append('key.0.nested', '2');
      input.append('key.1.nested', '3');
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({
        key: [{ nested: [1, 2] }, { nested: [3] }],
      });
    });
  });

  describe('should decode wrapped schema', () => {
    test('optional object', () => {
      const schema = optional(object({ key: string() }));
      const input = new FormData();
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual(undefined);
    });

    test('optional nested key', () => {
      const schema = object({ key: optional(string()) });
      const input = new FormData();
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({});
    });

    test('optional array', () => {
      const schema = object({ key: optional(array(string())) });
      const input = new FormData();
      const result = decodeFormData(schema, input);
      expect(result).toStrictEqual({});
    });
  });
});
