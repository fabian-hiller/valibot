import type { BaseSchema, ErrorMessage, Pipe } from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * String schema type.
 */
export interface StringSchema<TOutput = string>
  extends BaseSchema<string, TOutput> {
  /**
   * The schema type.
   */
  type: 'string';
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<string> | undefined;
}

/**
 * Creates a string schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A string schema.
 */
export function string(pipe?: Pipe<string>): StringSchema;

/**
 * Creates a string schema.
 *
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A string schema.
 */
export function string(
  message?: ErrorMessage,
  pipe?: Pipe<string>
): StringSchema;

export function string(
  arg1?: ErrorMessage | Pipe<string>,
  arg2?: Pipe<string>
): StringSchema {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = defaultArgs(arg1, arg2);

  // Create and return string schema
  return {
    type: 'string',
    async: false,
    message,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'string') {
        return schemaIssue(info, 'type', 'string', this.message, input);
      }

      // Execute pipe and return result
      return pipeResult(input, this.pipe, info, 'string');
    },
  };
}
