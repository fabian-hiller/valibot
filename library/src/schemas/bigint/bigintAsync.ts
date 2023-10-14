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
 * Bigint schema async type.
 */
export type BigintSchemaAsync<TOutput = bigint> = BaseSchemaAsync<
  bigint,
  TOutput
> & {
  kind: 'bigint';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates an async bigint schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async bigint schema.
 */
export function bigintAsync(pipe?: PipeAsync<bigint>): BigintSchemaAsync;

/**
 * Creates an async bigint schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async bigint schema.
 */
export function bigintAsync(
  error?: ErrorMessage,
  pipe?: PipeAsync<bigint>
): BigintSchemaAsync;

export function bigintAsync(
  arg1?: ErrorMessage | PipeAsync<bigint>,
  arg2?: PipeAsync<bigint>
): BigintSchemaAsync {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return async bigint schema
  return {
    kind: 'bigint',
    async: true,
    checks: getChecks(pipe),
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'bigint') {
        return getSchemaIssues(
          info,
          'type',
          'bigint',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipeAsync(input, pipe, info, 'bigint');
    },
  };
}
