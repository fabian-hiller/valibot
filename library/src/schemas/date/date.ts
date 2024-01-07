import type { BaseSchema, ErrorMessage, Pipe } from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Date schema type.
 */
export interface DateSchema<TOutput = Date> extends BaseSchema<Date, TOutput> {
  /**
   * The schema type.
   */
  type: 'date';
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<Date> | undefined;
}

/**
 * Creates a date schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A date schema.
 */
export function date(pipe?: Pipe<Date>): DateSchema;

/**
 * Creates a date schema.
 *
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A date schema.
 */
export function date(message?: ErrorMessage, pipe?: Pipe<Date>): DateSchema;

export function date(
  arg1?: ErrorMessage | Pipe<Date>,
  arg2?: Pipe<Date>
): DateSchema {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = defaultArgs(arg1, arg2);

  // Create and return date schema
  return {
    type: 'date',
    async: false,
    message,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (!(input instanceof Date) || isNaN(input.getTime())) {
        return schemaIssue(info, 'type', 'date', this.message, input);
      }

      // Execute pipe and return result
      return pipeResult(input, this.pipe, info, 'date');
    },
  };
}
