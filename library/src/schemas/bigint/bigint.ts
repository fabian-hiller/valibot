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
  message: ErrorMessage | undefined;
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
  const [message, pipe, metadata] = defaultArgs(arg1, arg2);

  // Create and return bigint schema
  return {
    type: 'bigint',
    expects: 'bigint',
    async: false,
    message,
    pipe,
    metadata,
    _parse(input, config) {
      // If type is valid, return pipe result
      if (typeof input === 'bigint') {
        return pipeResult(this, input, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, bigint, input, config);
    },
  };
}
