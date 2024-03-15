import type { BaseSchema, ErrorMessage, Pipe } from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Number schema type.
 */
export interface NumberSchema<TOutput = number>
  extends BaseSchema<number, TOutput> {
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
}

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
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A number schema.
 */
export function number(
  message?: ErrorMessage,
  pipe?: Pipe<number>
): NumberSchema;

export function number(
  arg1?: ErrorMessage | Pipe<number>,
  arg2?: Pipe<number>
): NumberSchema {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg1, arg2);

  // Create and return number schema
  return {
    type: 'number',
    expects: 'number',
    async: false,
    message,
    pipe,
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
