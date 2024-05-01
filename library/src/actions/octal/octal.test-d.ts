import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { octal, type OctalAction, type OctalIssue } from './octal.ts';

describe('octal', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = OctalAction<string, undefined>;
      expectTypeOf(octal<string>()).toEqualTypeOf<Action>();
      expectTypeOf(octal<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(octal<string, 'message'>('message')).toEqualTypeOf<
        OctalAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(octal<string, () => string>(() => 'message')).toEqualTypeOf<
        OctalAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = OctalAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<OctalIssue<string>>();
    });
  });
});
