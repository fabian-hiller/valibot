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
 * Date schema async type.
 */
export type DateSchemaAsync<TOutput = Date> = BaseSchemaAsync<Date, TOutput> & {
  /**
   * The schema type.
   */
  type: 'date';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<Date> | undefined;
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
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async date schema.
 */
export function dateAsync(
  message?: ErrorMessage,
  pipe?: PipeAsync<Date>
): DateSchemaAsync;

export function dateAsync(
  arg1?: ErrorMessage | PipeAsync<Date>,
  arg2?: PipeAsync<Date>
): DateSchemaAsync {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg1, arg2);

  // Create and return async date schema
  return {
    type: 'date',
    expects: 'Date',
    async: true,
    message,
    pipe,
    async _parse(input, config) {
      // Check type of input
      if (!(input instanceof Date) || isNaN(input.getTime())) {
        return schemaIssue(this, dateAsync, input, config);
      }

      // Execute pipe and return result
      return pipeResultAsync(this, input, config);
    },
  };
}
