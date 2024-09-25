import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import {
  ipv6Cidr,
  type Ipv6CidrAction,
  type Ipv6CidrIssue,
} from './ipv6Cidr.ts';

describe('ipv6Cidr', () => {
  describe('should return action object', () => {
    test('with undefined message', () => {
      type Action = Ipv6CidrAction<string, undefined>;
      expectTypeOf(ipv6Cidr<string>()).toEqualTypeOf<Action>();
      expectTypeOf(
        ipv6Cidr<string, undefined>(undefined)
      ).toEqualTypeOf<Action>();
    });

    test('with string message', () => {
      expectTypeOf(ipv6Cidr<string, 'message'>('message')).toEqualTypeOf<
        Ipv6CidrAction<string, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        ipv6Cidr<string, () => string>(() => 'message')
      ).toEqualTypeOf<Ipv6CidrAction<string, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Action = Ipv6CidrAction<string, undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<string>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<Ipv6CidrIssue<string>>();
    });
  });
});
