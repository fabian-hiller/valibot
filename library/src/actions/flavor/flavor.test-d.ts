import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { type Flavor, flavor, type FlavorAction } from './flavor.ts';

describe('flavor', () => {
  type Action = FlavorAction<string, 'foo'>;

  test('should allow unflavored input', () => {
    expectTypeOf<string>().toEqualTypeOf<InferInput<Action>>();
  });

  test('should not allow wrong flavors', () => {
    expectTypeOf(flavor<string, 'bar'>('bar')).not.toEqualTypeOf<
      InferInput<Action>
    >();
  });

  test('should return action object', () => {
    expectTypeOf(flavor<string, 'foo'>('foo')).toEqualTypeOf<Action>();
  });

  describe('should infer correct types', () => {
    test('of input', () => {
      expectTypeOf<InferInput<Action>>().toEqualTypeOf<string>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Action>>().toEqualTypeOf<
        string & Flavor<'foo'>
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Action>>().toEqualTypeOf<never>();
    });
  });
});
