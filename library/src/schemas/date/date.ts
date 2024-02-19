import type { BaseSchema, ErrorMessage, Pipe } from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Date schema type.
 */
export type DateSchema<TOutput = Date> = BaseSchema<Date, TOutput> & {
  /**
   * The schema type.
   */
  type: 'date';
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<Date> | undefined;
};

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
  const [message, pipe] = defaultArgs(arg1, arg2);

  // Create and return date schema
  return {
    type: 'date',
    expects: 'Date',
    async: false,
    message,
    pipe,
    _parse(input, config) {
      // If type is valid, return pipe result
      if (input instanceof Date && !isNaN(input.getTime())) {
        return pipeResult(this, input, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, date, input, config);
    },
  };
}
