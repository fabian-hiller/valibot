import { describe, expectTypeOf, test } from 'vitest';
import type {
  ArraySchema,
  NumberIssue,
  NumberSchema,
  ObjectSchema,
} from '../../schemas/index.ts';
import type { ArrayPathItem, ObjectPathItem } from '../../types/index.ts';
import { getDotPath } from './getDotPath.ts';

describe('getDotPath', () => {
  const issue: NumberIssue = {
    kind: 'schema',
    type: 'number',
    input: 'foo',
    expected: 'number',
    received: '"foo"',
    message: 'Invalid type: Expected number but received "foo"',
    path: [
      {
        type: 'object',
        origin: 'value',
        input: { dot: [{ path: 'foo' }] },
        key: 'dot',
        value: [{ path: 'foo' }],
      } satisfies ObjectPathItem,
      {
        type: 'array',
        origin: 'value',
        input: [{ path: 'foo' }],
        key: 0,
        value: { path: 'foo' },
      } satisfies ArrayPathItem,
      {
        type: 'object',
        origin: 'value',
        input: { path: 'foo' },
        key: 'path',
        value: 'foo',
      } satisfies ObjectPathItem,
    ],
    abortEarly: undefined,
    abortPipeEarly: undefined,
    issues: undefined,
    lang: undefined,
  };

  test('should return generic dot path', () => {
    expectTypeOf(getDotPath(issue)).toEqualTypeOf<string | null>();
  });

  test('should return specific dot path', () => {
    type Schema = ObjectSchema<
      {
        dot: ArraySchema<
          ObjectSchema<{ path: NumberSchema<undefined> }, undefined>,
          undefined
        >;
      },
      undefined
    >;
    expectTypeOf(getDotPath<Schema>(issue)).toEqualTypeOf<
      'dot' | `dot.${number}` | `dot.${number}.path` | null
    >();
  });
});
