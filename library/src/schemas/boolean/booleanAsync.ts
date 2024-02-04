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
 * Boolean schema async type.
 */
export type BooleanSchemaAsync<TOutput = boolean> = BaseSchemaAsync<
  boolean,
  TOutput
> & {
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
};

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
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async boolean schema.
 */
export function booleanAsync(
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: PipeAsync<boolean>
): BooleanSchemaAsync;

export function booleanAsync(
  arg1?: ErrorMessageOrMetadata | PipeAsync<boolean>,
  arg2?: PipeAsync<boolean>
): BooleanSchemaAsync {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(arg1, arg2);

  // Create and return async boolean schema
  return {
    type: 'boolean',
    async: true,
    message,
    pipe,
    metadata,
    async _parse(input, info) {
      // Check type of input
      if (typeof input !== 'boolean') {
        return schemaIssue(info, 'type', 'boolean', this.message, input);
      }

      // Execute pipe and return result
      return pipeResultAsync(input, this.pipe, info, 'boolean');
    },
  };
}
