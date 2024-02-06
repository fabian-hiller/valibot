import type { BaseSchema, Pipe, SchemaMetadata } from '../../types/index.ts';
import { defaultArgs, pipeResult } from '../../utils/index.ts';

/**
 * Unknown schema type.
 */
export type UnknownSchema<TOutput = unknown> = BaseSchema<unknown, TOutput> & {
  /**
   * The schema type.
   */
  type: 'unknown';
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<unknown> | undefined;
};

/**
 * Creates a unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns A unknown schema.
 */
export function unknown(pipe?: Pipe<unknown>): UnknownSchema;

/**
 * Creates a unknown schema.
 *
 * @param metadata Schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A unknown schema.
 */
export function unknown(
  metadata?: SchemaMetadata,
  pipe?: Pipe<unknown>
): UnknownSchema;

export function unknown(
  arg1?: SchemaMetadata | Pipe<unknown>,
  arg2?: Pipe<unknown>
): UnknownSchema {
  // Get pipe and metadata argument
  const [, pipe, metadata] = defaultArgs<Pipe<unknown>>(arg1, arg2);

  // Create and return unknown schema
  return {
    type: 'unknown',
    expects: 'unknown',
    async: false,
    pipe,
    metadata,
    _parse(input, config) {
      return pipeResult(this, input, config);
    },
  };
}
