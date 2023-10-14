import { describe, expect, test } from 'vitest';
import { string } from '../../../string/index.ts';
import { getTupleArgs } from './getTupleArgs.ts';

describe('getTupleArgs', () => {
  test('should return tuple args', () => {
    const schema = string();
    expect(getTupleArgs(undefined, undefined, undefined)).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
    expect(getTupleArgs(schema, undefined, undefined)).toEqual([
      schema,
      undefined,
      undefined,
    ]);
    expect(getTupleArgs(schema, [], undefined)).toEqual([
      schema,
      undefined,
      [],
    ]);
    expect(getTupleArgs(schema, 'error', undefined)).toEqual([
      schema,
      'error',
      undefined,
    ]);
    expect(getTupleArgs(schema, 'error', [])).toEqual([schema, 'error', []]);
    expect(getTupleArgs([], undefined, undefined)).toEqual([
      undefined,
      undefined,
      [],
    ]);
    expect(getTupleArgs('error', undefined, undefined)).toEqual([
      undefined,
      'error',
      undefined,
    ]);
    expect(getTupleArgs('error', [], undefined)).toEqual([
      undefined,
      'error',
      [],
    ]);
  });
});
