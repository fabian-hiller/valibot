import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { ipv4, type Ipv4Action, type Ipv4Issue } from './ipv4.ts';

describe('ipv4', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = Ipv4Action<string, undefined>;
      expectTypeOf(ipv4<string>()).toEqualTypeOf<Action>();
      expectTypeOf(ipv4<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(ipv4<string, 'message'>('message')).toEqualTypeOf<
        Ipv4Action<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(ipv4<string, () => string>(() => 'message')).toEqualTypeOf<
        Ipv4Action<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = Ipv4Action<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<Ipv4Issue<string>>();
    });
  });
});
