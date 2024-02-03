import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Pipe,
} from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';

/**
 * Bigint schema type.
 */
export type BigintSchema<TOutput = bigint> = BaseSchema<bigint, TOutput> & {
  /**
   * The schema type.
   */
  type: 'bigint';
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<bigint> | undefined;
};

/**
 * Creates a bigint schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A bigint schema.
 */
export function bigint(pipe?: Pipe<bigint>): BigintSchema;

/**
 * Creates a bigint schema.
 *
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A bigint schema.
 */
export function bigint(
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<bigint>
): BigintSchema;

export function bigint(
  arg1?: ErrorMessageOrMetadata | Pipe<bigint>,
  arg2?: Pipe<bigint>
): BigintSchema {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(arg1, arg2);

  // Create and return bigint schema
  return {
    type: 'bigint',
    async: false,
    message,
    pipe,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'bigint') {
        return schemaIssue(info, 'type', 'bigint', this.message, input);
      }

      // Execute pipe and return result
      return pipeResult(input, this.pipe, info, 'bigint');
    },
  };
}
