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
 * Number schema async type.
 */
export type NumberSchemaAsync<TOutput = number> = BaseSchemaAsync<
  number,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'number';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<number> | undefined;
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
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async number schema.
 */
export function numberAsync(
  message?: ErrorMessage,
  pipe?: PipeAsync<number>
): NumberSchemaAsync;

export function numberAsync(
  arg1?: ErrorMessage | PipeAsync<number>,
  arg2?: PipeAsync<number>
): NumberSchemaAsync {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg1, arg2);

  // Create and return async number schema
  return {
    type: 'number',
    expects: 'number',
    async: true,
    message,
    pipe,
    async _parse(input, config) {
      // Check type of input
      if (typeof input !== 'number' || isNaN(input)) {
        return schemaIssue(this, numberAsync, input, config);
      }

      // Execute pipe and return result
      return pipeResultAsync(this, input, config);
    },
  };
}
