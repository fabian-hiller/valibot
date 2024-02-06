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
 * String schema async type.
 */
export type StringSchemaAsync<TOutput = string> = BaseSchemaAsync<
  string,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'string';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<string> | undefined;
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
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async string schema.
 */
export function stringAsync(
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: PipeAsync<string>
): StringSchemaAsync;

export function stringAsync(
  arg1?: ErrorMessageOrMetadata | PipeAsync<string>,
  arg2?: PipeAsync<string>
): StringSchemaAsync {
  // Get message and pipe argument
  const [message, pipe, metadata] = defaultArgs(arg1, arg2);

  // Create and return async string schema
  return {
    type: 'string',
    expects: 'string',
    async: true,
    message,
    pipe,
    metadata,
    async _parse(input, config) {
      // If type is valid, return pipe result
      if (typeof input === 'string') {
        return pipeResultAsync(this, input, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, stringAsync, input, config);
    },
  };
}
