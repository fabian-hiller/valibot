import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchema, Pipe } from '../../types.ts';
import { executePipe, getErrorAndPipe } from '../../utils/index.ts';

/**
 * Date schema type.
 */
export type DateSchema<TOutput = Date> = BaseSchema<Date, TOutput> & {
  schema: 'date';
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
export function date(error?: string, pipe?: Pipe<Date>): DateSchema;

export function date(
  arg1?: string | Pipe<Date>,
  arg2?: Pipe<Date>
): DateSchema {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg1, arg2);

  // Create and return date schema
  return {
    /**
     * The schema type.
     */
    schema: 'date',

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    parse(input, info) {
      // Check type of input
      if (!(input instanceof Date)) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'date',
            origin: 'value',
            message: error || i18next.t("schemas.date"),
            input,
            ...info,
          },
        ]);
      }

      // Execute pipe and return output
      return executePipe(input, pipe, { ...info, reason: 'date' });
    },
  };
}
