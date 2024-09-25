import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { ipv4Cidr, type Ipv4CidrAction, type Ipv4CidrIssue } from './ipv4Cidr.ts';

describe('ipv4Cidr', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = Ipv4CidrAction<string, undefined>;
      expectTypeOf(ipv4Cidr<string>()).toEqualTypeOf<Action>();
      expectTypeOf(ipv4Cidr<string, undefined>(undefined)).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(ipv4Cidr<string, 'message'>('message')).toEqualTypeOf<
        Ipv4CidrAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(ipv4Cidr<string, () => string>(() => 'message')).toEqualTypeOf<
        Ipv4CidrAction<string, () => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Action = Ipv4CidrAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<Ipv4CidrIssue<string>>();
    });
  });
});
