import type {
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';

/**
 * Special schema async type.
 */
export interface SpecialSchemaAsync<TInput, TOutput = TInput>
  extends BaseSchemaAsync<TInput, TOutput> {
  /**
   * The schema type.
   */
  type: 'special';
  /**
   * The type check function.
   */
  check: (input: unknown) => boolean | Promise<boolean>;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<TInput> | undefined;
}

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
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function specialAsync<TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  message?: ErrorMessage,
  pipe?: PipeAsync<TInput>
): SpecialSchemaAsync<TInput>;

export function specialAsync<TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  arg2?: PipeAsync<TInput> | ErrorMessage,
  arg3?: PipeAsync<TInput>
): SpecialSchemaAsync<TInput> {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg2, arg3);

  // Create and return string schema
  return {
    type: 'special',
    expects: 'unknown',
    async: true,
    check,
    message,
    pipe,
    async _parse(input, config) {
      // If check is fulfilled, return pipe output
      if (await this.check(input)) {
        return pipeResultAsync(this, input as TInput, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, specialAsync, input, config);
    },
  };
}
