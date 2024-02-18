import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  MaybePromise,
  Output,
  SchemaMetadata,
} from '../../types/index.ts';

/**
 * Recursive schema async type.
 */
export type RecursiveSchemaAsync<
  TGetter extends (
    input: unknown
  ) => MaybePromise<BaseSchema | BaseSchemaAsync>,
  TOutput = Output<Awaited<ReturnType<TGetter>>>
> = BaseSchemaAsync<Input<Awaited<ReturnType<TGetter>>>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'recursive';
  /**
   * The schema getter.
   */
  getter: TGetter;
};

/**
 * Creates an async recursive schema.
 *
 * @param getter The schema getter.
 * @param metadata The schema metadata.
 *
 * @returns An async recursive schema.
 */
export function recursiveAsync<
  TGetter extends (input: unknown) => MaybePromise<BaseSchema | BaseSchemaAsync>
>(getter: TGetter, metadata?: SchemaMetadata): RecursiveSchemaAsync<TGetter> {
  return {
    type: 'recursive',
    expects: 'unknown',
    async: true,
    getter,
    metadata,
    async _parse(input, config) {
      return (await this.getter(input))._parse(input, config);
    },
  };
}
