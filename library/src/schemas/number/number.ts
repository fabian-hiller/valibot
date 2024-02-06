import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Number schema type.
 */
export type NumberSchema<TOutput = number> = BaseSchema<number, TOutput> & {
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
  pipe: Pipe<number> | undefined;
};

/**
 * Creates a number schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A number schema.
 */
export function number(pipe?: Pipe<number>): NumberSchema;

/**
 * Creates a number schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A number schema.
 */
export function number(
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<number>
): NumberSchema;

export function number(
  arg1?: ErrorMessageOrMetadata | Pipe<number>,
  arg2?: Pipe<number>
): NumberSchema {
  // Get message and pipe argument
  const [message, pipe, metadata] = defaultArgs(arg1, arg2);

  // Create and return number schema
  return {
    type: 'number',
    expects: 'number',
    async: false,
    message,
    pipe,
    metadata,
    _parse(input, config) {
      // If type is valid, return pipe result
      if (typeof input === 'number' && !isNaN(input)) {
        return pipeResult(this, input, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, number, input, config);
    },
  };
}
