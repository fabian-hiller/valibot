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
 * Bigint schema async type.
 */
export interface BigintSchemaAsync<TOutput = bigint>
  extends BaseSchemaAsync<bigint, TOutput> {
  /**
   * The schema type.
   */
  type: 'bigint';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<bigint> | undefined;
}

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
  const [message, pipe] = defaultArgs(arg1, arg2);

  // Create and return async bigint schema
  return {
    type: 'bigint',
    expects: 'bigint',
    async: true,
    message,
    pipe,
    async _parse(input, config) {
      // If type is valid, return pipe result
      if (typeof input === 'bigint') {
        return pipeResultAsync(this, input, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, bigintAsync, input, config);
    },
  };
}
