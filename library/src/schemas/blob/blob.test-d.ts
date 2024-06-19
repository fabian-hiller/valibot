import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { blob, type BlobIssue, type BlobSchema } from './blob.ts';

describe('blob', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = BlobSchema<undefined>;
      expectTypeOf(blob()).toEqualTypeOf<Schema>();
      expectTypeOf(blob(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(blob('message')).toEqualTypeOf<BlobSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(blob(() => 'message')).toEqualTypeOf<
        BlobSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = BlobSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<Blob>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<Blob>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<BlobIssue>();
    });
  });
});
