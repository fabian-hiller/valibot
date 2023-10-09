import type { BaseSchemaAsync, ErrorMessage, PipeAsync } from '../../types.ts';
import {
  executePipeAsync,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Special schema async type.
 */
export type SpecialSchemaAsync<TInput, TOutput = TInput> = BaseSchemaAsync<
  TInput,
  TOutput
> & {
  schema: 'special';
};

/**
 * Creates an async special schema.
 *
 * @param check The type check function.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async special schema.
 */
export function specialAsync<TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  pipe?: PipeAsync<TInput>
): SpecialSchemaAsync<TInput>;

/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async special schema.
 */
export function specialAsync<TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  error?: ErrorMessage,
  pipe?: PipeAsync<TInput>
): SpecialSchemaAsync<TInput>;

/**
 * @param check The type check function.
 * @param arg2 A validation and transformation pipe, or an error message.
 * @param arg3 A validation and transformation pipe.
 *
 * @returns An async special schema.
 */
export function specialAsync<TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  arg2?: PipeAsync<TInput> | ErrorMessage,
  arg3?: PipeAsync<TInput>
): SpecialSchemaAsync<TInput> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return string schema
  return {
    /**
     * The schema type.
     */
    schema: 'special',

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      // Check type of input
      if (!(await check(input))) {
        return getSchemaIssues(
          info,
          'type',
          'special',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipeAsync(input as TInput, pipe, info, 'special');
    },
  };
}
