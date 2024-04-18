import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { ipv4, type IpV4Action, type IpV4Issue } from './ipv4.ts';

describe('ipv4', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IpV4Action<string, undefined>;
      expectTypeOf(ipv4<string>()).toEqualTypeOf<Action>();
      expectTypeOf(ipv4<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(ipv4<string, 'message'>('message')).toEqualTypeOf<
        IpV4Action<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(ipv4<string, () => string>(() => 'message')).toEqualTypeOf<
        IpV4Action<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = IpV4Action<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<IpV4Issue<string>>();
    });
  });
});
