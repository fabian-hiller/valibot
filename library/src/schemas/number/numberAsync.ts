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
 * Number schema async type.
 */
export type NumberSchemaAsync<TOutput = number> = BaseSchemaAsync<
  number,
  TOutput
> & {
  kind: 'number';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates an async number schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async number schema.
 */
export function numberAsync(pipe?: PipeAsync<number>): NumberSchemaAsync;

/**
 * Creates an async number schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async number schema.
 */
export function numberAsync(
  error?: ErrorMessage,
  pipe?: PipeAsync<number>
): NumberSchemaAsync;

export function numberAsync(
  arg1?: ErrorMessage | PipeAsync<number>,
  arg2?: PipeAsync<number>
): NumberSchemaAsync {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return async number schema
  return {
    kind: 'number',
    async: true,
    checks: getChecks(pipe),
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'number' || Number.isNaN(input)) {
        return getSchemaIssues(
          info,
          'type',
          'number',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipeAsync(input, pipe, info, 'number');
    },
  };
}
