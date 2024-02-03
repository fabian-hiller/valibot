import type {
  BaseSchemaAsync,
  PipeAsync,
  SchemaMetadata,
} from '../../types/index.ts';
import { defaultArgs, pipeResultAsync } from '../../utils/index.ts';

/**
 * Any schema type.
 */
export type AnySchemaAsync<TOutput = any> = BaseSchemaAsync<any, TOutput> & {
  /**
   * The schema type.
   */
  type: 'any';
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<any> | undefined;
};

/**
 * Creates an any schema.
 *
 * @param pipe A validation and transformation pipe.
 *
 * @returns An any schema.
 */
export function anyAsync(pipe?: PipeAsync<any>): AnySchemaAsync;
/**
 * Creates an async any schema.
 *
 * @param metadata Schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async any schema.
 */
export function anyAsync(
  metadata?: SchemaMetadata,
  pipe?: PipeAsync<any>
): AnySchemaAsync;

export function anyAsync(
  arg1?: SchemaMetadata | PipeAsync<any>,
  arg2?: PipeAsync<any>
): AnySchemaAsync {
  const [, pipe, metadata] = defaultArgs<PipeAsync<any>>(arg1, arg2);
  return {
    type: 'any',
    async: true,
    pipe,
    metadata,
    async _parse(input, info) {
      return pipeResultAsync(input, this.pipe, info, 'any');
    },
  };
}
