import type {
  BaseSchemaAsync,
  PipeAsync,
  SchemaMetadata,
} from '../../types/index.ts';
import { defaultArgs, pipeResultAsync } from '../../utils/index.ts';

/**
 * Unknown schema async type.
 */
export type UnknownSchemaAsync<TOutput = unknown> = BaseSchemaAsync<
  unknown,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'unknown';
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<unknown> | undefined;
};

/**
 * Creates an async unknown schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async unknown schema.
 */
export function unknownAsync(pipe?: PipeAsync<unknown>): UnknownSchemaAsync;
/**
 * Creates an async unknown schema.
 *
 * @param metadata Schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async unknown schema.
 */
export function unknownAsync(
  metadata?: SchemaMetadata,
  pipe?: PipeAsync<unknown>
): UnknownSchemaAsync;

export function unknownAsync(
  arg1?: SchemaMetadata | PipeAsync<unknown>,
  arg2?: PipeAsync<unknown>
): UnknownSchemaAsync {
  // Get pipe and metadata argument
  const [, pipe, metadata] = defaultArgs<PipeAsync<unknown>>(arg1, arg2);

  // Create and return unknown schema
  return {
    type: 'unknown',
    async: true,
    pipe,
    metadata,
    async _parse(input, info) {
      return pipeResultAsync(input, this.pipe, info, 'unknown');
    },
  };
}
