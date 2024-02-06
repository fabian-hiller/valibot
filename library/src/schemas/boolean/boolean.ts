import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Boolean schema type.
 */
export type BooleanSchema<TOutput = boolean> = BaseSchema<boolean, TOutput> & {
  /**
   * The schema type.
   */
  type: 'boolean';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<boolean> | undefined;
};

/**
 * Creates a boolean schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A boolean schema.
 */
export function boolean(pipe?: Pipe<boolean>): BooleanSchema;

/**
 * Creates a boolean schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A boolean schema.
 */
export function boolean(
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<boolean>
): BooleanSchema;

export function boolean(
  arg1?: ErrorMessageOrMetadata | Pipe<boolean>,
  arg2?: Pipe<boolean>
): BooleanSchema {
  // Get message and pipe argument
  const [message, pipe, metadata] = defaultArgs(arg1, arg2);

  // Create and return boolean schema
  return {
    type: 'boolean',
    expects: 'boolean',
    async: false,
    message,
    pipe,
    metadata,
    _parse(input, config) {
      // If type is valid, return pipe result
      if (typeof input === 'boolean') {
        return pipeResult(this, input, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, boolean, input, config);
    },
  };
}
