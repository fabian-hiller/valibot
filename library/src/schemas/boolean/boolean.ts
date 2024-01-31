import type { BaseSchema, ErrorMessage, Pipe } from '../../types/index.ts';
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
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A boolean schema.
 */
export function boolean(
  message?: ErrorMessage,
  pipe?: Pipe<boolean>
): BooleanSchema;

export function boolean(
  arg1?: ErrorMessage | Pipe<boolean>,
  arg2?: Pipe<boolean>
): BooleanSchema {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg1, arg2);

  // Create and return boolean schema
  return {
    type: 'boolean',
    expects: 'boolean',
    async: false,
    message,
    pipe,
    _parse(input, config) {
      // Check type of input
      if (typeof input !== 'boolean') {
        return schemaIssue(this, boolean, input, config);
      }

      // Execute pipe and return result
      return pipeResult(this, input, config);
    },
  };
}
