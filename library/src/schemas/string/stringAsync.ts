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
 * String schema async type.
 */
export type StringSchemaAsync<TOutput = string> = BaseSchemaAsync<
  string,
  TOutput
> & {
  kind: 'string';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
};

/**
 * Creates an async string schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async string schema.
 */
export function stringAsync(pipe?: PipeAsync<string>): StringSchemaAsync;

/**
 * Creates an async string schema.
 *
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async string schema.
 */
export function stringAsync(
  error?: ErrorMessage,
  pipe?: PipeAsync<string>
): StringSchemaAsync;

export function stringAsync(
  arg1?: ErrorMessage | PipeAsync<string>,
  arg2?: PipeAsync<string>
): StringSchemaAsync {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return async string schema
  return {
    kind: 'string',
    async: true,
    checks: getChecks(pipe),
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'string') {
        return getSchemaIssues(
          info,
          'type',
          'string',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipeAsync(input, pipe, info, 'string');
    },
  };
}
