import type {
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
} from '../../types/index.ts';
import {
  executePipeAsync,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Boolean schema async type.
 */
export interface BooleanSchemaAsync<TOutput = boolean>
  extends BaseSchemaAsync<boolean, TOutput> {
  /**
   * The schema type.
   */
  type: 'boolean';
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<boolean> | undefined;
}

/**
 * Creates an async boolean schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async boolean schema.
 */
export function booleanAsync(pipe?: PipeAsync<boolean>): BooleanSchemaAsync;

/**
 * Creates an async boolean schema.
 *
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async boolean schema.
 */
export function booleanAsync(
  message?: ErrorMessage,
  pipe?: PipeAsync<boolean>
): BooleanSchemaAsync;

export function booleanAsync(
  arg1?: ErrorMessage | PipeAsync<boolean>,
  arg2?: PipeAsync<boolean>
): BooleanSchemaAsync {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = getDefaultArgs(arg1, arg2);

  // Create and return async boolean schema
  return {
    type: 'boolean',
    async: true,
    message,
    pipe,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'boolean') {
        return getSchemaIssues(info, 'type', 'boolean', this.message, input);
      }

      // Execute pipe and return result
      return executePipeAsync(input, this.pipe, info, 'boolean');
    },
  };
}
