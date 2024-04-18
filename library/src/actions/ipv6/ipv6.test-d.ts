import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { ipv6, type IpV6Action, type IpV6Issue } from './ipv6.ts';

describe('ipv6', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = IpV6Action<string, undefined>;
      expectTypeOf(ipv6<string>()).toEqualTypeOf<Action>();
      expectTypeOf(ipv6<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(ipv6<string, 'message'>('message')).toEqualTypeOf<
        IpV6Action<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(ipv6<string, () => string>(() => 'message')).toEqualTypeOf<
        IpV6Action<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = IpV6Action<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<IpV6Issue<string>>();
    });
  });
});
