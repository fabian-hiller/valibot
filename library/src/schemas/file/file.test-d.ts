import { describe, expectTypeOf, test } from 'vitest';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import { file, type FileIssue, type FileSchema } from './file.ts';

describe('file', () => {
  describe('should return schema object', () => {
    test('with undefined message', () => {
      type Schema = FileSchema<undefined>;
      expectTypeOf(file()).toEqualTypeOf<Schema>();
      expectTypeOf(file(undefined)).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(file('message')).toEqualTypeOf<FileSchema<'message'>>();
    });

    test('with function message', () => {
      expectTypeOf(file(() => 'message')).toEqualTypeOf<
        FileSchema<() => string>
      >();
    });
  });

  describe('should infer correct types', () => {
    type Schema = FileSchema<undefined>;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<File>();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<File>();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<FileIssue>();
    });
  });
});
