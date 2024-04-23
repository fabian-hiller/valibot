import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { ipv6, type Ipv6Action, type Ipv6Issue } from './ipv6.ts';

describe('ipv6', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = Ipv6Action<string, undefined>;
      expectTypeOf(ipv6<string>()).toEqualTypeOf<Action>();
      expectTypeOf(ipv6<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(ipv6<string, 'message'>('message')).toEqualTypeOf<
        Ipv6Action<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(ipv6<string, () => string>(() => 'message')).toEqualTypeOf<
        Ipv6Action<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = Ipv6Action<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<Ipv6Issue<string>>();
    });
  });
});
