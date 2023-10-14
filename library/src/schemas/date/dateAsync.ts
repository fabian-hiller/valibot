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
 * Date schema async type.
 */
export type DateSchemaAsync<TOutput = Date> = BaseSchemaAsync<Date, TOutput> & {
  kind: 'date';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates an async date schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async date schema.
 */
export function dateAsync(pipe?: PipeAsync<Date>): DateSchemaAsync;

/**
 * Creates an async date schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async date schema.
 */
export function dateAsync(
  error?: ErrorMessage,
  pipe?: PipeAsync<Date>
): DateSchemaAsync;

export function dateAsync(
  arg1?: ErrorMessage | PipeAsync<Date>,
  arg2?: PipeAsync<Date>
): DateSchemaAsync {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return async date schema
  return {
    kind: 'date',
    async: true,
    checks: getChecks(pipe),
    async _parse(input, info) {
      // Check type of input
      if (!(input instanceof Date)) {
        return getSchemaIssues(
          info,
          'type',
          'date',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipeAsync(input, pipe, info, 'date');
    },
  };
}
