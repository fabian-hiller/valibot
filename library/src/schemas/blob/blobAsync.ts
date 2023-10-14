import type {
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
  PipeMeta,
} from '../../types.ts';
import { getChecks } from '../../utils/getChecks/getChecks.ts';
import {
  executePipeAsync,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Blob schema async type.
 */
export type BlobSchemaAsync<TOutput = Blob> = BaseSchemaAsync<Blob, TOutput> & {
  kind: 'blob';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates an async blob schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async blob schema.
 */
export function blobAsync(pipe?: PipeAsync<Blob>): BlobSchemaAsync;

/**
 * Creates an async blob schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async blob schema.
 */
export function blobAsync(
  error?: ErrorMessage,
  pipe?: PipeAsync<Blob>
): BlobSchemaAsync;

export function blobAsync(
  arg1?: ErrorMessage | PipeAsync<Blob>,
  arg2?: PipeAsync<Blob>
): BlobSchemaAsync {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return async blob schema
  return {
    kind: 'blob',
    async: true,
    checks: getChecks(pipe),
    async _parse(input, info) {
      // Check type of input
      if (!(input instanceof Blob)) {
        return getSchemaIssues(
          info,
          'type',
          'blob',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipeAsync(input, pipe, info, 'blob');
    },
  };
}
