import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Pipe,
} from '../../types/index.ts';
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
  message: ErrorMessage;
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
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A date schema.
 */
export function date(
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<Date>
): DateSchema;

export function date(
  arg1?: ErrorMessageOrMetadata | Pipe<Date>,
  arg2?: Pipe<Date>
): DateSchema {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(arg1, arg2);

  // Create and return date schema
  return {
    type: 'date',
    async: false,
    message,
    pipe,
    metadata,
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
