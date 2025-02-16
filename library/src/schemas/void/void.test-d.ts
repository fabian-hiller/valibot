import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { void_, type VoidIssue, type VoidSchema } from './void.ts';

describe('void', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = VoidSchema<undefined>;
      expectTypeOf(void_()).toEqualTypeOf<Schema>();
      expectTypeOf(void_(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(void_('message')).toEqualTypeOf<VoidSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(void_(() => 'message')).toEqualTypeOf<
        VoidSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = VoidSchema<undefined>;

    test('of input', () => {
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<void>();
    });

    test('of output', () => {
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<void>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<VoidIssue>();
    });
  });
});
