import type { BaseSchema, ErrorMessage, Pipe, PipeMeta } from '../../types.ts';
import { getChecks } from '../../utils/getChecks/getChecks.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Date schema type.
 */
export type DateSchema<TOutput = Date> = BaseSchema<Date, TOutput> & {
  kind: 'date';
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
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
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A date schema.
 */
export function date(error?: ErrorMessage, pipe?: Pipe<Date>): DateSchema;

export function date(
  arg1?: ErrorMessage | Pipe<Date>,
  arg2?: Pipe<Date>
): DateSchema {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg1, arg2);

  // Create and return date schema
  return {
    kind: 'date',
    async: false,
    checks: getChecks(pipe),
    _parse(input, info) {
      // Check type of input
      if (!(input instanceof Date)) {
        return getSchemaIssues(
          info,
          'type',
          'date',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input, pipe, info, 'date');
    },
  };
}
