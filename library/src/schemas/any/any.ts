import type { BaseSchema, Pipe, SchemaMetadata } from '../../types/index.ts';
import { defaultArgs, pipeResult } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export type AnySchema<TOutput = any> = BaseSchema<any, TOutput> & {
  /**
   * The schema type.
   */
  type: 'any';
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<any> | undefined;
};

/**
 * Creates an any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An any schema.
 */
export function any(pipe?: Pipe<any>): AnySchema;

/**
 * Creates an any schema.
 *
 * @param metadata Schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An any schema.
 */
export function any(metadata?: SchemaMetadata, pipe?: Pipe<any>): AnySchema;

export function any(
  arg1?: SchemaMetadata | Pipe<any>,
  arg2?: Pipe<any>
): AnySchema {
  const [, pipe, metadata] = defaultArgs<Pipe<any>>(arg1, arg2);
  return {
    type: 'any',
    async: false,
    pipe,
    metadata,
    _parse(input, info) {
      return pipeResult(input, this.pipe, info, 'any');
    },
  };
}
