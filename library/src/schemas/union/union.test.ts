import { describe, expect, test } from 'vitest';
import { email, minLength, url } from '../../actions/index.ts';
import { pipe } from '../../methods/index.ts';
import type {
  FailureDataset,
  InferIssue,
  InferOutput,
  PartialDataset,
} from '../../types/index.ts';
import { expectNoSchemaIssue, expectSchemaIssue } from '../../vitest/index.ts';
import { literal } from '../literal/literal.ts';
import { number } from '../number/index.ts';
import { string } from '../string/index.ts';
import { union, type UnionSchema } from './union.ts';

describe('union', () => {
  describe('should return schema object', () => {
    const options = [literal('foo'), literal('bar'), number()] as const;
    type Options = typeof options;
    const baseSchema: Omit<UnionSchema<Options, never>, 'message'> = {
      kind: 'schema',
      type: 'union',
      reference: union,
      expects: '("foo" | "bar" | number)',
      options,
      async: false,
      '~standard': {
        version: 1,
        vendor: 'valibot',
        validate: expect.any(Function),
      },
      '~run': expect.any(Function),
    };

    test('with undefined message', () => {
      const schema: UnionSchema<Options, undefined> = {
        ...baseSchema,
        message: undefined,
      };
      expect(union(options)).toStrictEqual(schema);
      expect(union(options, undefined)).toStrictEqual(schema);
    });

    test('with string message', () => {
      expect(union(options, 'message')).toStrictEqual({
        ...baseSchema,
        message: 'message',
      } satisfies UnionSchema<Options, 'message'>);
    });

    test('with function message', () => {
      const message = () => 'message';
      expect(union(options, message)).toStrictEqual({
        ...baseSchema,
        message,
      } satisfies UnionSchema<Options, typeof message>);
    });
  });

  describe('should return dataset without issues', () => {
    test('for valid values', () => {
      expectNoSchemaIssue(union([literal('foo'), literal('bar'), number()]), [
        'foo',
        'bar',
        123,
      ]);
    });
  });

  describe('should return dataset with issues', () => {
    const baseInfo = {
      message: expect.any(String),
      requirement: undefined,
      path: undefined,
      issues: undefined,
      lang: undefined,
      abortEarly: undefined,
      abortPipeEarly: undefined,
    };

    test('with single typed issue', () => {
      const schema = union([pipe(string(), minLength(5)), number()]);
      type Schema = typeof schema;
      expect(schema['~run']({ value: 'foo' }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
        issues: [
          {
            ...baseInfo,
            kind: 'validation',
            type: 'min_length',
            input: 'foo',
            expected: '>=5',
            received: '3',
            requirement: 5,
          },
        ],
      } satisfies PartialDataset<InferOutput<Schema>, InferIssue<Schema>>);
    });

    test('with multiple typed issues', () => {
      const schema = union([pipe(string(), email()), pipe(string(), url())]);
      type Schema = typeof schema;
      expect(schema['~run']({ value: 'foo' }, {})).toStrictEqual({
        typed: true,
        value: 'foo',
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'union',
            input: 'foo',
            // TODO: Investigate if there is a better solution for `expected`
            // and `received` to prevent such situations that are not logical
            expected: 'string',
            received: '"foo"',
            issues: [
              {
                ...baseInfo,
                kind: 'validation',
                type: 'email',
                input: 'foo',
                expected: null,
                received: '"foo"',
                requirement: expect.any(RegExp),
              },
              {
                ...baseInfo,
                kind: 'validation',
                type: 'url',
                input: 'foo',
                expected: null,
                received: '"foo"',
                requirement: expect.any(Function),
              },
            ],
          },
        ],
      } satisfies PartialDataset<InferOutput<Schema>, InferIssue<Schema>>);
    });

    test('with zero untyped issue', () => {
      expectSchemaIssue(
        union([]),
        {
          kind: 'schema',
          type: 'union',
          expected: 'never',
          message: expect.any(String),
        },
        ['foo', 123, null, undefined]
      );
    });

    test('with single untyped issue', () => {
      const schema = union([literal('foo')]);
      expect(schema['~run']({ value: 'bar' }, {})).toStrictEqual({
        typed: false,
        value: 'bar',
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'literal',
            input: 'bar',
            expected: '"foo"',
            received: '"bar"',
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });

    test('with multiple typed issues', () => {
      const schema = union([string(), number()]);
      expect(schema['~run']({ value: null }, {})).toStrictEqual({
        typed: false,
        value: null,
        issues: [
          {
            ...baseInfo,
            kind: 'schema',
            type: 'union',
            input: null,
            expected: '(string | number)',
            received: 'null',
            issues: [
              {
                ...baseInfo,
                kind: 'schema',
                type: 'string',
                input: null,
                expected: 'string',
                received: 'null',
              },
              {
                ...baseInfo,
                kind: 'schema',
                type: 'number',
                input: null,
                expected: 'number',
                received: 'null',
              },
            ],
          },
        ],
      } satisfies FailureDataset<InferIssue<typeof schema>>);
    });
  });
});
