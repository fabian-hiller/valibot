import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
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
  message: ErrorMessage;
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
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async number schema.
 */
export function numberAsync(
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: PipeAsync<number>
): NumberSchemaAsync;

export function numberAsync(
  arg1?: ErrorMessageOrMetadata | PipeAsync<number>,
  arg2?: PipeAsync<number>
): NumberSchemaAsync {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(arg1, arg2);

  // Create and return async number schema
  return {
    type: 'number',
    async: true,
    message,
    pipe,
    metadata,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'number' || isNaN(input)) {
        return schemaIssue(info, 'type', 'number', this.message, input);
      }

      // Execute pipe and return result
      return pipeResultAsync(input, this.pipe, info, 'number');
    },
  };
}
