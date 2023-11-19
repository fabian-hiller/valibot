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
 * Bigint schema async type.
 */
export type BigintSchemaAsync<TOutput = bigint> = BaseSchemaAsync<
  bigint,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'bigint';
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<bigint> | undefined;
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
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async bigint schema.
 */
export function bigintAsync(
  message?: ErrorMessage,
  pipe?: PipeAsync<bigint>
): BigintSchemaAsync;

export function bigintAsync(
  arg1?: ErrorMessage | PipeAsync<bigint>,
  arg2?: PipeAsync<bigint>
): BigintSchemaAsync {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = getDefaultArgs(arg1, arg2);

  // Create and return async bigint schema
  return {
    type: 'bigint',
    async: true,
    message,
    pipe,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'bigint') {
        return getSchemaIssues(info, 'type', 'bigint', this.message, input);
      }

      // Execute pipe and return result
      return executePipeAsync(input, this.pipe, info, 'bigint');
    },
  };
}
