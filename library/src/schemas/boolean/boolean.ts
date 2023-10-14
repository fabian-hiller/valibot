import type { BaseSchema, ErrorMessage, Pipe } from '../../types.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Boolean schema type.
 */
export type BooleanSchema<TOutput = boolean> = BaseSchema<boolean, TOutput> & {
  kind: 'boolean';
  /**
   * Validation and transformation pipe.
   */
  pipe: Pipe<boolean>;
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
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A boolean schema.
 */
export function boolean(
  error?: ErrorMessage,
  pipe?: Pipe<boolean>
): BooleanSchema;

export function boolean(
  arg1?: ErrorMessage | Pipe<boolean>,
  arg2?: Pipe<boolean>
): BooleanSchema {
  // Get error and pipe argument
  const [error, pipe = []] = getDefaultArgs(arg1, arg2);

  // Create and return boolean schema
  return {
    kind: 'boolean',
    async: false,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'boolean') {
        return getSchemaIssues(
          info,
          'type',
          'boolean',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input, pipe, info, 'boolean');
    },
  };
}
